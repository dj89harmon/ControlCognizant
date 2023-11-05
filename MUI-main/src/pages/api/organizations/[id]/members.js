import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function users(req, res) {
    const {accessToken } = await getAccessToken(req, res);
    const response = await fetch(`http://localhost:8080/organizations/${req.query.id}/members/`, {
      method: req.method,
      body: req.method !== 'GET' ? JSON.stringify(req.body): undefined,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': req.method !== 'GET' ? 'application/json; charset=UTF-8' : undefined,
    }
  });
  
  const members = await response.json();
  for (const member of members) {
    const roles = await fetch(`http://localhost:8080/organizations/${req.query.id}/members/${encodeURIComponent(member.user_id)}/roles`, {headers:{Authorization: `Bearer ${accessToken}`}});
    member.roles = await roles.json();
  }
  res.status(response.status).json(members);
})