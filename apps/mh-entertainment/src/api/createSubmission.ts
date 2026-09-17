import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new submission record from any of the four submission forms',
  inputSchema: z.object({
    submissionType: z.enum(['project', 'radio', 'tv_video', 'other']),
    projectName: z.string().min(1),
    submitterName: z.string().min(1),
    email: z.string().email(),
    artistName: z.string().min(1),
    country: z.string().min(1),
    formData: z.record(z.unknown()),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    submissionId: z.number().optional(),
  }),
  execute: async ({ input }) => {
    const typeMap: Record<string, string> = {
      project: 'Submit My Project',
      radio: 'Radio Single',
      tv_video: 'TV Music Video',
      other: 'Other Opportunities',
    };

    const record = await zite.submissions.create({
      record: {
        projectName: input.projectName,
        submissionType: typeMap[input.submissionType] || input.submissionType,
        submitterName: input.submitterName,
        email: input.email,
        artistName: input.artistName,
        country: input.country,
        status: 'New Submission',
        formData: JSON.stringify(input.formData),
      },
    });

    return { success: true, submissionId: record.submissionId };
  },
});
