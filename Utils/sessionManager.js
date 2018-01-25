class sessionManager {
    saveUserProfile(session, UserProfile) {
        session.UserProfile = UserProfile;
    }
    getUserProfile(session) {
        if (!session.UserProfile) return null
        return session.UserProfile;
    }
}

module.exports = new sessionManager();