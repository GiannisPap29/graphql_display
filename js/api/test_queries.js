const TestQueries = {
    FirstQuery: `
    query GetTeammates($userId: Int!) {
  group(
    where: { members: { userId: { _eq: $userId } } }
  ) {
    id
    path
    object {
      name
      type
    }
    members(where: { userId: { _neq: $userId } }) {
      user {
        id
        githubId
        githubLogin
      }
    }
  }
}
`};