export async function dispatchSovereignCommand(prompt: string, history: any[], coordinates: any, token: string | null) {
  if (!token) {
    throw new Error('Authentication token is required for Sovereign Cognition.');
  }

  const response = await fetch('/api/sovereign/cognition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // using the passed firebase session token or cached OAuth
    },
    body: JSON.stringify({
      prompt,
      chatHistory: history,
      userLocationContext: coordinates
    })
  });

  return await response.json();
}
