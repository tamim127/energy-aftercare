import { useState } from 'react';
import { toast } from 'sonner';
import { createSubmission } from 'zitejs/api';
import FormLayout from '../components/FormLayout';
import MultiStepForm from '../components/MultiStepForm';
import { FormInput, FormTextarea, FormSelect, FormFile, FormRadio, FormCheckbox } from '../components/FormFields';

export default function SubmitProjectPage() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Record<string, any>>({
    represented: '',
    consent: false,
    newsletter: false,
  });

  const set = (key: string, val: any) => setData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!data.artistName || !data.email || !data.country || !data.artistType || !data.genre || !data.projectType || !data.projectTitle || !data.projectDescription) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!data.consent) {
      toast.error('Please confirm the consent statement');
      return;
    }
    setIsSubmitting(true);
    try {
      await createSubmission({
        submissionType: 'project',
        projectName: data.projectTitle || '',
        submitterName: data.artistName || '',
        email: data.email || '',
        artistName: data.artistName || '',
        country: data.country || '',
        formData: data,
      });
      setSuccess(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const artistTypeOptions = ['Solo Artist', 'Band / Group', 'Producer', 'DJ', 'Songwriter', 'Other'].map(v => ({ value: v, label: v }));
  const genreOptions = ['Pop', 'Hip-Hop / Rap', 'R&B / Soul', 'Afrobeat', 'Gospel', 'Electronic', 'Rock', 'Reggae', 'Jazz', 'World Music', 'Other'].map(v => ({ value: v, label: v }));
  const projectTypeOptions = ['Single', 'EP', 'Album', 'Music Video', 'Other'].map(v => ({ value: v, label: v }));

  const steps = [
    {
      label: 'Artist Information',
      shortLabel: 'Artist',
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="Artist / Stage Name" required value={data.artistName || ''} onChange={e => set('artistName', e.target.value)} />
          <FormInput label="Legal Name" value={data.legalName || ''} onChange={e => set('legalName', e.target.value)} />
          <FormInput label="Email Address" required type="email" value={data.email || ''} onChange={e => set('email', e.target.value)} />
          <FormInput label="Phone Number" type="tel" value={data.phone || ''} onChange={e => set('phone', e.target.value)} />
          <FormInput label="Country" required value={data.country || ''} onChange={e => set('country', e.target.value)} />
          <FormInput label="City" value={data.city || ''} onChange={e => set('city', e.target.value)} />
          <FormInput label="Website" type="url" value={data.website || ''} onChange={e => set('website', e.target.value)} />
          <FormInput label="Instagram" value={data.instagram || ''} onChange={e => set('instagram', e.target.value)} />
          <FormInput label="Facebook" value={data.facebook || ''} onChange={e => set('facebook', e.target.value)} />
          <FormInput label="TikTok" value={data.tiktok || ''} onChange={e => set('tiktok', e.target.value)} />
          <FormInput label="YouTube" value={data.youtube || ''} onChange={e => set('youtube', e.target.value)} />
          <FormInput label="Spotify Artist Profile" value={data.spotify || ''} onChange={e => set('spotify', e.target.value)} />
          <FormInput label="Apple Music Artist Profile" value={data.appleMusic || ''} onChange={e => set('appleMusic', e.target.value)} />
        </div>
      ),
    },
    {
      label: 'Professional Information',
      shortLabel: 'Professional',
      content: (
        <div className="space-y-6">
          <FormSelect label="Artist Type" required options={artistTypeOptions} value={data.artistType || ''} onChange={e => set('artistType', e.target.value)} />
          <FormSelect label="Genre" required options={genreOptions} value={data.genre || ''} onChange={e => set('genre', e.target.value)} />
          <FormSelect label="Project Type" required options={projectTypeOptions} value={data.projectType || ''} onChange={e => set('projectType', e.target.value)} />
        </div>
      ),
    },
    {
      label: 'Project Information',
      shortLabel: 'Project',
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="Project / Release Title" required value={data.projectTitle || ''} onChange={e => set('projectTitle', e.target.value)} />
          <FormInput label="Artist Name" required value={data.projectArtist || ''} onChange={e => set('projectArtist', e.target.value)} />
          <FormInput label="Release Date" type="date" value={data.releaseDate || ''} onChange={e => set('releaseDate', e.target.value)} />
          <FormInput label="Project Website / Link" value={data.projectWebsite || ''} onChange={e => set('projectWebsite', e.target.value)} />
          <FormInput label="Streaming Link" value={data.streamingLink || ''} onChange={e => set('streamingLink', e.target.value)} />
          <FormInput label="Private Listening Link" value={data.privateLink || ''} onChange={e => set('privateLink', e.target.value)} />
          <div className="md:col-span-2">
            <FormTextarea label="Project Description" required value={data.projectDescription || ''} onChange={e => set('projectDescription', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <FormTextarea label="Short Artist Biography" value={data.biography || ''} onChange={e => set('biography', e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      label: 'Uploads & Media',
      shortLabel: 'Uploads',
      content: (
        <div className="space-y-6">
          <FormFile label="Upload Audio / Music File" required accept=".mp3,.wav,.flac" onChange={(f) => set('audioFile', f)} />
          <FormFile label="Additional Music Files" accept=".mp3,.wav,.flac" multiple onChange={(f) => set('additionalAudio', f)} />
          <FormFile label="Upload Artist Photo" accept="image/*" onChange={(f) => set('artistPhoto', f)} />
          <FormFile label="Upload Cover Artwork" accept="image/*" onChange={(f) => set('coverArt', f)} />
          <FormFile label="Upload Press Kit / EPK" accept=".pdf,.doc,.docx,.zip" onChange={(f) => set('pressKit', f)} />
          <FormFile label="Upload Additional Documents" accept=".pdf,.doc,.docx,.zip" multiple onChange={(f) => set('additionalDocs', f)} />
        </div>
      ),
    },
    {
      label: 'Representation & Consent',
      shortLabel: 'Submit',
      content: (
        <div className="space-y-8">
          <FormRadio
            label="Are you currently represented by a record label, manager, publisher, or agency?"
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            value={data.represented}
            onChange={(v) => set('represented', v)}
          />
          {data.represented === 'yes' && (
            <div className="grid md:grid-cols-2 gap-6 pl-6 border-l border-black/10">
              <FormInput label="Company / Label Name" value={data.companyName || ''} onChange={e => set('companyName', e.target.value)} />
              <FormInput label="Contact Person" value={data.contactPerson || ''} onChange={e => set('contactPerson', e.target.value)} />
              <FormInput label="Website" value={data.companyWebsite || ''} onChange={e => set('companyWebsite', e.target.value)} />
              <div className="md:col-span-2">
                <FormTextarea label="Additional Information" value={data.additionalInfo || ''} onChange={e => set('additionalInfo', e.target.value)} />
              </div>
            </div>
          )}
          <div className="space-y-4 pt-4 border-t border-black/10">
            <FormCheckbox
              label="I confirm that the information provided is accurate and that I have the necessary rights and permissions to submit this project to MH Entertainment."
              required
              checked={data.consent}
              onChange={(v) => set('consent', v)}
            />
            <FormCheckbox
              label="I agree to receive news, updates, and opportunities from MH Entertainment."
              checked={data.newsletter}
              onChange={(v) => set('newsletter', v)}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title="SUBMIT MY PROJECT"
      intro="Are you an artist, producer, or music professional with a project you would like to submit to MH Entertainment? Complete the form below and provide the information and materials needed for our team to review your project."
      success={success}
      successMessage="Thank you for submitting your project to MH Entertainment. Your submission has been received and will be reviewed by our team."
    >
      <MultiStepForm steps={steps} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="SUBMIT MY PROJECT" />
    </FormLayout>
  );
}
