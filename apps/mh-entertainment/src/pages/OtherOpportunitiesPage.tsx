import { useState } from 'react';
import { toast } from 'sonner';
import { createSubmission } from 'zitejs/api';
import FormLayout from '../components/FormLayout';
import MultiStepForm from '../components/MultiStepForm';
import { FormInput, FormTextarea, FormSelect, FormFile, FormCheckbox } from '../components/FormFields';

export default function OtherOpportunitiesPage() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Record<string, any>>({ consent: false });
  const set = (key: string, val: any) => setData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!data.fullName || !data.companyName || !data.email || !data.country || !data.submissionType || !data.projectName || !data.description) {
      toast.error('Please fill in all required fields'); return;
    }
    if (!data.consent) { toast.error('Please confirm the consent statement'); return; }
    setIsSubmitting(true);
    try {
      await createSubmission({
        submissionType: 'other',
        projectName: data.projectName || '',
        submitterName: data.fullName || '',
        email: data.email || '',
        artistName: data.companyName || '',
        country: data.country || '',
        formData: data,
      });
      setSuccess(true);
    } catch { toast.error('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const categoryOptions = [
    'Music Licensing', 'Press / Media', 'Artist Collaboration', 'Distribution',
    'Label Partnership', 'Radio Promotion', 'TV Promotion', 'Event / Performance',
    'Brand Partnership', 'Other',
  ].map(v => ({ value: v, label: v }));

  const steps = [
    {
      label: 'Contact Information', shortLabel: 'Contact',
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="Full Name" required value={data.fullName || ''} onChange={e => set('fullName', e.target.value)} />
          <FormInput label="Artist / Company Name" required value={data.companyName || ''} onChange={e => set('companyName', e.target.value)} />
          <FormInput label="Email" required type="email" value={data.email || ''} onChange={e => set('email', e.target.value)} />
          <FormInput label="Phone" type="tel" value={data.phone || ''} onChange={e => set('phone', e.target.value)} />
          <FormInput label="Country" required value={data.country || ''} onChange={e => set('country', e.target.value)} />
          <FormInput label="Website" type="url" value={data.website || ''} onChange={e => set('website', e.target.value)} />
          <FormInput label="Social Media" value={data.socialMedia || ''} onChange={e => set('socialMedia', e.target.value)} className="md:col-span-2" />
        </div>
      ),
    },
    {
      label: 'Submission Details', shortLabel: 'Details',
      content: (
        <div className="space-y-6">
          <FormSelect label="Submission Type" required options={categoryOptions} value={data.submissionType || ''} onChange={e => set('submissionType', e.target.value)} />
          <FormInput label="Project / Opportunity Name" required value={data.projectName || ''} onChange={e => set('projectName', e.target.value)} />
          <FormTextarea label="Description" required value={data.description || ''} onChange={e => set('description', e.target.value)} />
          <FormInput label="Project Link" value={data.projectLink || ''} onChange={e => set('projectLink', e.target.value)} />
          <FormInput label="Relevant Website" value={data.relevantWebsite || ''} onChange={e => set('relevantWebsite', e.target.value)} />
          <FormInput label="Streaming / Media Link" value={data.mediaLink || ''} onChange={e => set('mediaLink', e.target.value)} />
        </div>
      ),
    },
    {
      label: 'Uploads & Consent', shortLabel: 'Submit',
      content: (
        <div className="space-y-6">
          <FormFile label="Upload Supporting Files" multiple onChange={f => set('supportingFiles', f)} />
          <FormFile label="Upload Press Kit / EPK" accept=".pdf,.doc,.docx,.zip" onChange={f => set('pressKit', f)} />
          <FormFile label="Upload Additional Documents" multiple onChange={f => set('additionalDocs', f)} />
          <FormTextarea label="Message / Additional Information" value={data.message || ''} onChange={e => set('message', e.target.value)} />
          <div className="pt-6 border-t border-black/10">
            <FormCheckbox
              label="I confirm that the information submitted is accurate and that I have the necessary rights to submit the materials provided."
              required
              checked={data.consent}
              onChange={v => set('consent', v)}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title="OTHER OPPORTUNITIES"
      intro="Explore additional music, media, licensing, partnership, and collaboration opportunities with MH Entertainment."
      success={success}
      successMessage="Thank you for contacting MH Entertainment. Your submission has been received."
    >
      <MultiStepForm steps={steps} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="SUBMIT REQUEST" />
    </FormLayout>
  );
}
