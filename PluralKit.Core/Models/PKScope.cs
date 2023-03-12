namespace PluralKit.Core;

public enum PKScope
{
    None = 0, // No extra data, only public. Main use is identification.
    Administrator = 1 << 0, // Ignore all scopes and act as if we have permission.
    // Systems Scopes
    GetSystem = 1 << 1, // Get private system data (including privacy, settings, etc).
    ModifySystem = 1 << 2, // Modify system data (including privacy, settings, etc).

    // Autoproxy Scopes
    GetAutoproxy = 1 << 3, // Get current autoproxy settings.
    ModifyAutoproxy = 1 << 4, // Modify autoproxy settings.
    
    // Members Scopes
    GetMemberList = 1 << 5, // Get the full member list, excluding private members.
    GetMembers = 1 << 6, // See private members in lists.
    GetMemberData = 1 << 7, // Get the data for a specific member.
    CreateMembers = 1 << 8, // Create a new member.
    DeleteMembers = 1 << 9, // Delete an existing member.
    ModifyMembers = 1 << 10, // Modify members.
    
    // Groups Scopes
    GetGroupList = 1 << 11, // Get the full group list, excluding private groups.
    GetGroups = 1 << 12, // See private groups in lists.
    GetGroupData = 1 << 13, // Get the data for a group, including private data.
    CreateGroups = 1 << 14, // Create a new group.
    DeleteGroups = 1 << 15, // Delete an existing group.
    ModifyGroups = 1 << 16, // Modify groups
    GetGroupMembers = 1 << 17, // Get the members in a group, including private members.
    ModifyGroupMembers = 1 << 18, // Modify the members in a group.
    
    // Switches Scopes
    GetSwitchList = 1 << 19, // Get the list of switches.
    GetCurrentFront = 1 << 20, // Get the current fronter.
    CreateSwitches = 1 << 21, // Create a new switch.
    DeleteSwitches = 1 << 22, // Delete an existing switches.
    ModifySwitches = 1 << 23, // Modify switches.
    
    // Misc Scopes
    Guild = 1 << 24 // Get/Modify guild-specific information for the scopes already selected.
}