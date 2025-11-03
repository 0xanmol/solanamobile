/**
 * Friends API
 * Mock implementations that log request/response data
 */

export interface Friend {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUri?: string;
  alreadyFriend?: boolean;
}

/**
 * Get all friends
 */
export const getFriends = async (): Promise<Friend[]> => {
  const request = {
    endpoint: 'GET /api/friends',
  };
  console.log('[API] Request:', request);

  const response: Friend[] = [
    {
      id: 'friend_1',
      name: 'Aarav',
      email: 'aarav@example.com',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Add friend by email/name
 */
export const addFriend = async (data: { name: string; email: string }): Promise<{ success: boolean; friend: Friend }> => {
  const request = {
    endpoint: 'POST /api/friends',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    friend: {
      id: 'friend_' + Date.now(),
      name: data.name,
      email: data.email,
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Invite friend (send invitation)
 */
export const inviteFriend = async (data: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'POST /api/friends/invite',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Invitation sent successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get phone contacts
 */
export const getContacts = async (): Promise<Contact[]> => {
  const request = {
    endpoint: 'GET /api/friends/contacts',
  };
  console.log('[API] Request:', request);

  const response: Contact[] = [
    { id: 'c1', name: '1', phone: '+919606933222', alreadyFriend: true },
    { id: 'c2', name: '2', phone: '+919606933222' },
    { id: 'c3', name: 'AJAY Fmcg VERMA', phone: '+918619282800' },
    { id: 'c7', name: 'Aarav', phone: '', alreadyFriend: true },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Remove friend
 */
export const removeFriend = async (friendId: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `DELETE /api/friends/${friendId}`,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Friend removed successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

