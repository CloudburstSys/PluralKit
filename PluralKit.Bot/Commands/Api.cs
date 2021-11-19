using System.Threading.Tasks;

using Myriad.Extensions;
using Myriad.Rest.Exceptions;
using Myriad.Rest.Types.Requests;
using Myriad.Types;

using PluralKit.Core;

namespace PluralKit.Bot
{
    public class Api
    {
        private readonly ModelRepository _repo;
        private readonly DispatchService _dispatch;
        public Api(ModelRepository repo, DispatchService dispatch)
        {
            _repo = repo;
            _dispatch = dispatch;
        }

        public async Task GetToken(Context ctx)
        {
            ctx.CheckSystem();

            // Get or make a token
            var token = ctx.System.Token ?? await MakeAndSetNewToken(ctx.System);

            try
            {
                // DM the user a security disclaimer, and then the token in a separate message (for easy copying on mobile)
                var dm = await ctx.Cache.GetOrCreateDmChannel(ctx.Rest, ctx.Author.Id);
                await ctx.Rest.CreateMessage(dm.Id, new MessageRequest
                {
                    Content = $"{Emojis.Warn} Please note that this grants access to modify (and delete!) all your system data, so keep it safe and secure. If it leaks or you need a new one, you can invalidate this one with `pk;token refresh`.\n\nYour token is below:"
                });
                await ctx.Rest.CreateMessage(dm.Id, new MessageRequest { Content = token });

                // If we're not already in a DM, reply with a reminder to check
                if (ctx.Channel.Type != Channel.ChannelType.Dm)
                    await ctx.Reply($"{Emojis.Success} Check your DMs!");
            }
            catch (ForbiddenException)
            {
                // Can't check for permission errors beforehand, so have to handle here :/
                if (ctx.Channel.Type != Channel.ChannelType.Dm)
                    await ctx.Reply($"{Emojis.Error} Could not send token in DMs. Are your DMs closed?");
            }
        }

        private async Task<string> MakeAndSetNewToken(PKSystem system)
        {
            system = await _repo.UpdateSystem(system.Id, new() { Token = StringUtils.GenerateToken() });
            return system.Token;
        }

        public async Task RefreshToken(Context ctx)
        {
            ctx.CheckSystem();

            if (ctx.System.Token == null)
            {
                // If we don't have a token, call the other method instead
                // This does pretty much the same thing, except words the messages more appropriately for that :)
                await GetToken(ctx);
                return;
            }

            try
            {
                // DM the user an invalidation disclaimer, and then the token in a separate message (for easy copying on mobile)
                var dm = await ctx.Cache.GetOrCreateDmChannel(ctx.Rest, ctx.Author.Id);
                await ctx.Rest.CreateMessage(dm.Id, new MessageRequest
                {
                    Content = $"{Emojis.Warn} Your previous API token has been invalidated. You will need to change it anywhere it's currently used.\n\nYour token is below:"
                });

                // Make the new token after sending the first DM; this ensures if we can't DM, we also don't end up
                // breaking their existing token as a side effect :)
                var token = await MakeAndSetNewToken(ctx.System);
                await ctx.Rest.CreateMessage(dm.Id, new MessageRequest { Content = token });

                // If we're not already in a DM, reply with a reminder to check
                if (ctx.Channel.Type != Channel.ChannelType.Dm)
                    await ctx.Reply($"{Emojis.Success} Check your DMs!");
            }
            catch (ForbiddenException)
            {
                // Can't check for permission errors beforehand, so have to handle here :/
                if (ctx.Channel.Type != Channel.ChannelType.Dm)
                    await ctx.Reply($"{Emojis.Error} Could not send token in DMs. Are your DMs closed?");
            }
        }

        public async Task SystemWebhook(Context ctx)
        {
            ctx.CheckDMContext();

            if (!ctx.HasNext(false))
            {
                if (ctx.System.WebhookUrl == null)
                    await ctx.Reply("Your system does not have a webhook URL set. Set one with `pk;system webhook <url>`!");
                else
                    await ctx.Reply($"Your system's webhook URL is <{ctx.System.WebhookUrl}>.");
                return;
            }

            if (await ctx.MatchClear("your system's webhook URL"))
            {
                await _repo.UpdateSystem(ctx.System.Id, new()
                {
                    WebhookUrl = null,
                    WebhookToken = null,
                });

                await ctx.Reply($"{Emojis.Success} System webhook URL removed.");
                return;
            }

            var newUrl = ctx.RemainderOrNull();
            if (!await DispatchExt.ValidateUri(newUrl))
                throw new PKError($"The URL {newUrl.AsCode()} is invalid or I cannot access it. Are you sure this is a valid, publicly accessible URL?");

            var newToken = StringUtils.GenerateToken();

            await _repo.UpdateSystem(ctx.System.Id, new()
            {
                WebhookUrl = newUrl,
                WebhookToken = newToken,
            });

            await ctx.Reply($"{Emojis.Success} Successfully the new webhook URL for your system."
                + $"\n\n{Emojis.Warn} The following token is used to authenticate requests from PluralKit to you."
                + " If it leaks, you should clear and re-set the webhook URL to get a new token."
                + "\ntodo: add link to docs or something"
            );

            await ctx.Reply(newToken);
        }
    }
}