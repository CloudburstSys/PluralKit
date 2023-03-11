using Newtonsoft.Json.Linq;

namespace PluralKit.Core;

public readonly struct TokenId: INumericId<TokenId, int>
{
    public int Value { get; }

    public TokenId(int value)
    {
        Value = value;
    }

    public bool Equals(TokenId other) => Value == other.Value;

    public override bool Equals(object obj) => obj is TokenId other && Equals(other);

    public override int GetHashCode() => Value;

    public static bool operator ==(TokenId left, TokenId right) => left.Equals(right);

    public static bool operator !=(TokenId left, TokenId right) => !left.Equals(right);

    public int CompareTo(TokenId other) => Value.CompareTo(other.Value);

    public override string ToString() => $"Token #{Value}";
}

public class PKToken
{
    public TokenId Id { get; private set; }
    public string Token { get; private set; }
    public SystemId System { get; private set; }
    // TODO: Create Application type
    public int Scope { get; private set; }
}

public static class PKTokenExt
{
    public static JObject ToJson(this PKToken token)
    {
        var o = new JObject();
        
        o.Add("id", token.Id.ToString());
        o.Add("token", token.Token);
        o.Add("system", token.System.ToString());
        // TODO: Create Application type
        o.Add("scope", token.Scope);

        return o;
    }
}