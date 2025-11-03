/**
 * Invites API
 * Mock implementations that log request/response data
 */

export interface InviteLink {
  groupId: string;
  link: string;
  expiresAt?: string;
}

/**
 * Get group invite link
 */
export const getInviteLink = async (groupId: string): Promise<InviteLink> => {
  const request = {
    endpoint: `GET /api/invites/${groupId}`,
  };
  console.log('[API] Request:', request);

  const response: InviteLink = {
    groupId,
    link: `https://www.splitwise.com/join/P8Q4sFjdi5x+1v28fw?v=s`,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Copy invite link to clipboard
 */
export const copyInviteLink = async (groupId: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `GET /api/invites/${groupId}`,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Link copied to clipboard',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Share invite link
 */
export const shareInviteLink = async (
  groupId: string,
  method: 'sms' | 'email' | 'whatsapp' | 'other'
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `POST /api/invites/${groupId}/share`,
    body: { method },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: `Link shared via ${method}`,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Change/regenerate invite link
 */
export const changeInviteLink = async (groupId: string): Promise<{ success: boolean; link: string }> => {
  const request = {
    endpoint: `POST /api/invites/${groupId}/regenerate`,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    link: `https://www.splitwise.com/join/NEW_LINK_${Date.now()}?v=s`,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Join group via invite link
 */
export const joinGroupByLink = async (inviteCode: string): Promise<{ success: boolean; groupId: string }> => {
  const request = {
    endpoint: 'POST /api/invites/join',
    body: { inviteCode },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    groupId: 'group_' + Date.now(),
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

