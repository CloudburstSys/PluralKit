using Newtonsoft.Json.Linq;

namespace PluralKit.Core;

public readonly struct ApplicationId: INumericId<ApplicationId, int>
{
    public int Value { get; }

    public ApplicationId(int value)
    {
        Value = value;
    }

    public bool Equals(ApplicationId other) => Value == other.Value;

    public override bool Equals(object obj) => obj is ApplicationId other && Equals(other);

    public override int GetHashCode() => Value;

    public static bool operator ==(ApplicationId left, ApplicationId right) => left.Equals(right);

    public static bool operator !=(ApplicationId left, ApplicationId right) => !left.Equals(right);

    public int CompareTo(ApplicationId other) => Value.CompareTo(other.Value);

    public override string ToString() => $"Application #{Value}";
}

public class PKApplication
{
    public ApplicationId Id { get; private set; }
    public Guid Uuid { get; private set; }
    public string Name { get; private set; }
    public string AvatarUrl { get; private set; }
    public string Description { get; private set; }
    public string RedirectUrl { get; private set; }
}

public static class PKApplicationExt
{
    public static JObject ToJson(this PKApplication application)
    {
        var o = new JObject();
        o.Add("uuid", application.Uuid.ToString());
        o.Add("name", application.Name);
        o.Add("avatar_url", application.AvatarUrl);
        o.Add("description", application.Description);
        o.Add("redirect_url", application.RedirectUrl);

        return o;
    }
}