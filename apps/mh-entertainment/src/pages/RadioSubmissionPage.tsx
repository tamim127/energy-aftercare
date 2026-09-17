import { useState } from 'react';
import { toast } from 'sonner';
import { createSubmission } from 'zitejs/api';
import FormLayout from '../components/FormLayout';
import MultiStepForm from '../components/MultiStepForm';
import { FormInput, FormTextarea, FormSelect, FormFile, FormRadio, FormCheckbox } from '../components/FormFields';

export default function RadioSubmissionPage() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Record<string, any>>({ onRadio: '', consent: false, newsletter: false });
  const set = (key: string, val: any) => setData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!data.contactName || !data.artistName || !data.email || !data.country || !data.role || !data.songTitle || !data.songArtist || !data.genre || !data.releaseDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!data.consent) { toast.error('Please confirm the consent statement'); return; }
    setIsSubmitting(true);
    try {
      await createSubmission({
        submissionType: 'radio',
        projectName: data.songTitle || '',
        submitterName: data.contactName || '',
        email: data.email || '',
        artistName: data.artistName || '',
        country: data.country || '',
        formData: data,
      });
      setSuccess(true);
    } catch { toast.error('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const roleOptions = ['Artist', 'Record Label', 'Manager', 'Publicist', 'Distributor', 'Other'].map(v => ({ value: v, label: v }));
  const genreOptions = ['Pop', 'Hip-Hop / Rap', 'R&B / Soul', 'Afrobeat', 'Gospel', 'Electronic', 'Rock', 'Reggae', 'Jazz', 'World Music', 'Other'].map(v => ({ value: v, label: v }));

  const steps = [
    {
      label: 'Contact Information', shortLabel: 'Contact',
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="Contact Name" required value={data.contactName || ''} onChange={e => set('contactName', e.target.value)} />
          <FormInput label="Artist / Stage Name" required value={data.artistName || ''} onChange={e => set('artistName', e.target.value)} />
          <FormInput label="Email Address" required type="email" value={data.email || ''} onChange={e => set('email', e.target.value)} />
          <FormInput label="Phone Number" type="tel" value={data.phone || ''} onChange={e => set('phone', e.target.value)} />
          <FormInput label="Country" required value={data.country || ''} onChange={e => set('country', e.target.value)} />
          <FormInput label="City" value={data.city || ''} onChange={e => set('city', e.target.value)} />
          <FormInput label="Company / Label" value={data.company || ''} onChange={e => set('company', e.target.value)} />
          <FormSelect label="Role" required options={roleOptions} value={data.role || ''} onChange={e => set('role', e.target.value)} />
        </div>
      ),
    },
    {
      label: 'Single Information', shortLabel: 'Single',
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="Song Title" required value={data.songTitle || ''} onChange={e => set('songTitle', e.target.value)} />
          <FormInput label="Artist Name" required value={data.songArtist || ''} onChange={e => set('songArtist', e.target.value)} />
          <FormInput label="Featured Artist" value={data.featuredArtist || ''} onChange={e => set('featuredArtist', e.target.value)} />
          <FormSelect label="Genre" required options={genreOptions} value={data.genre || ''} onChange={e => set('genre', e.target.value)} />
          <FormInput label="Language" value={data.language || ''} onChange={e => set('language', e.target.value)} />
          <FormInput label="Release Date" required type="date" value={data.releaseDate || ''} onChange={e => set('releaseDate', e.target.value)} />
          <FormInput label="ISRC Code" value={data.isrc || ''} onChange={e => set('isrc', e.target.value)} />
          <FormInput label="Label" value={data.label || ''} onChange={e => set('label', e.target.value)} />
          <FormInput label="Publisher" value={data.publisher || ''} onChange={e => set('publisher', e.target.value)} />
          <FormInput label="Distributor" value={data.distributor || ''} onChange={e => set('distributor', e.target.value)} />
          <FormInput label="Songwriter / Composer" value={data.songwriter || ''} onChange={e => set('songwriter', e.target.value)} />
          <FormInput label="Producer" value={data.producer || ''} onChange={e => set('producer', e.target.value)} />
        </div>
      ),
    },
    {
      label: 'Radio & Promotion', shortLabel: 'Radio',
      content: (
        <div className="space-y-6">
          <FormRadio label="Is this single already available on radio?" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value={data.onRadio} onChange={v => set('onRadio', v)} />
          {data.onRadio === 'yes' && (
            <div className="grid md:grid-cols-2 gap-6 pl-6 border-l border-black/10">
              <FormInput label="Previous Radio Stations / Networks" value={data.prevRadio || ''} onChange={e => set('prevRadio', e.target.value)} />
              <FormInput label="Countries" value={data.radioCountries || ''} onChange={e => set('radioCountries', e.target.value)} />
              <div className="md:col-span-2"><FormTextarea label="Broadcast Information" value={data.broadcastInfo || ''} onChange={e => set('broadcastInfo', e.target.value)} /></div>
            </div>
          )}
          <FormInput label="Target Countries" value={data.targetCountries || ''} onChange={e => set('targetCountries', e.target.value)} />
          <FormInput label="Target Radio Stations" value={data.targetRadio || ''} onChange={e => set('targetRadio', e.target.value)} />
          <FormInput label="Desired Radio Campaign Start Date" type="date" value={data.campaignDate || ''} onChange={e => set('campaignDate', e.target.value)} />
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-black/10">
            <FormInput label="Streaming Link" value={data.streamingLink || ''} onChange={e => set('streamingLink', e.target.value)} />
            <FormInput label="Spotify Link" value={data.spotifyLink || ''} onChange={e => set('spotifyLink', e.target.value)} />
            <FormInput label="Apple Music Link" value={data.appleMusicLink || ''} onChange={e => set('appleMusicLink', e.target.value)} />
            <FormInput label="YouTube Link" value={data.youtubeLink || ''} onChange={e => set('youtubeLink', e.target.value)} />
            <FormInput label="Private Listening Link" value={data.privateLink || ''} onChange={e => set('privateLink', e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      label: 'Uploads', shortLabel: 'Uploads',
      content: (
        <div className="space-y-6">
          <FormFile label="Upload Radio-Ready Audio" required accept=".mp3,.wav" onChange={f => set('radioAudio', f)} />
          <FormFile label="Upload Clean / Radio Edit" accept=".mp3,.wav" onChange={f => set('cleanEdit', f)} />
          <FormFile label="Upload Explicit Version" accept=".mp3,.wav" onChange={f => set('explicitVersion', f)} />
          <FormFile label="Upload Cover Artwork" accept="image/*" onChange={f => set('coverArt', f)} />
          <FormFile label="Upload Press Release" accept=".pdf,.doc,.docx" onChange={f => set('pressRelease', f)} />
          <FormFile label="Upload EPK" accept=".pdf,.doc,.docx,.zip" onChange={f => set('epk', f)} />
        </div>
      ),
    },
    {
      label: 'Promotion & Consent', shortLabel: 'Submit',
      content: (
        <div className="space-y-6">
          <FormTextarea label="Why should this single be considered for radio?" value={data.whyRadio || ''} onChange={e => set('whyRadio', e.target.value)} />
          <FormTextarea label="Artist Biography" value={data.biography || ''} onChange={e => set('biography', e.target.value)} />
          <FormTextarea label="Single Description" value={data.singleDescription || ''} onChange={e => set('singleDescription', e.target.value)} />
          <FormTextarea label="Additional Promotion Information" value={data.promoInfo || ''} onChange={e => set('promoInfo', e.target.value)} />
          <div className="space-y-4 pt-6 border-t border-black/10">
            <FormCheckbox label="I confirm that I own or control the necessary rights to submit this recording for radio consideration." required checked={data.consent} onChange={v => set('consent', v)} />
            <FormCheckbox label="I would like MH Entertainment to contact me regarding radio promotion opportunities." checked={data.newsletter} onChange={v => set('newsletter', v)} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title="RADIO SINGLE SUBMISSION"
      intro="Submit your single for radio consideration and promotion through the MH Entertainment network and partner radio stations."
      success={success}
      successMessage="Your radio single submission has been received. Thank you for submitting your music to MH Entertainment."
    >
      <MultiStepForm steps={steps} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="SUBMIT SINGLE FOR RADIO" />
    </FormLayout>
  );
}
