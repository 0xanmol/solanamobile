/**
 * Other/Miscellaneous APIs
 * Mock implementations that log request/response data
 */

/**
 * Update timezone
 */
export const updateTimezone = async (timezone: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/user/timezone',
    body: { timezone },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Timezone updated successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update language
 */
export const updateLanguage = async (language: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/user/language',
    body: { language },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Language updated successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

