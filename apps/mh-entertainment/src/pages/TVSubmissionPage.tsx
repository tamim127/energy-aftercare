import { useState } from 'react';
import { toast } from 'sonner';
import { createSubmission } from 'zitejs/api';
import FormLayout from '../components/FormLayout';
import MultiStepForm from '../components/MultiStepForm';
import { FormInput, FormTextarea, FormSelect, FormFile, FormRadio, FormCheckbox } from '../components/FormFields';

export default function TVSubmissionPage() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Record<string, any>>({ onTV: '', consent: false, newsletter: false });
  const set = (key: string, val: any) => setData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!data.contactName || !data.artistName || !data.email || !data.country || !data.role || !data.videoTitle || !data.songTitle || !data.videoArtist || !data.genre || !data.videoUrl || !data.videoDescription) {
      toast.error('Please fill in all required fields'); return;
    }
    if (!data.consent) { toast.error('Please confirm the consent statement'); return; }
    setIsSubmitting(true);
    try {
      await createSubmission({
        submissionType: 'tv_video',
        projectName: data.videoTitle || '',
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
  const tvCategoryOptions = ['Music Video', 'Entertainment', 'Cultural', 'Other'].map(v => ({ value: v, label: v }));

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
      label: 'Music Video Information', shortLabel: 'Video',
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="Video Title" required value={data.videoTitle || ''} onChange={e => set('videoTitle', e.target.value)} />
          <FormInput label="Song Title" required value={data.songTitle || ''} onChange={e => set('songTitle', e.target.value)} />
          <FormInput label="Artist Name" required value={data.videoArtist || ''} onChange={e => set('videoArtist', e.target.value)} />
          <FormInput label="Featured Artist" value={data.featuredArtist || ''} onChange={e => set('featuredArtist', e.target.value)} />
          <FormSelect label="Genre" required options={genreOptions} value={data.genre || ''} onChange={e => set('genre', e.target.value)} />
          <FormInput label="Language" value={data.language || ''} onChange={e => set('language', e.target.value)} />
          <FormInput label="Release Date" type="date" value={data.releaseDate || ''} onChange={e => set('releaseDate', e.target.value)} />
          <FormInput label="Director" value={data.director || ''} onChange={e => set('director', e.target.value)} />
          <FormInput label="Production Company" value={data.prodCompany || ''} onChange={e => set('prodCompany', e.target.value)} />
          <FormInput label="Label" value={data.label || ''} onChange={e => set('label', e.target.value)} />
          <FormInput label="Publisher" value={data.publisher || ''} onChange={e => set('publisher', e.target.value)} />
          <FormInput label="ISRC" value={data.isrc || ''} onChange={e => set('isrc', e.target.value)} />
          <FormInput label="ISWC" value={data.iswc || ''} onChange={e => set('iswc', e.target.value)} />
        </div>
      ),
    },
    {
      label: 'Video Details & Television', shortLabel: 'TV',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput label="Official Music Video URL" required value={data.videoUrl || ''} onChange={e => set('videoUrl', e.target.value)} />
            <FormInput label="YouTube Link" value={data.youtubeLink || ''} onChange={e => set('youtubeLink', e.target.value)} />
            <FormInput label="Vimeo Link" value={data.vimeoLink || ''} onChange={e => set('vimeoLink', e.target.value)} />
            <FormInput label="Private Video Link" value={data.privateLink || ''} onChange={e => set('privateLink', e.target.value)} />
            <FormInput label="Video Download Link" value={data.downloadLink || ''} onChange={e => set('downloadLink', e.target.value)} />
            <FormInput label="Video Duration" value={data.duration || ''} onChange={e => set('duration', e.target.value)} placeholder="e.g. 3:45" />
            <FormInput label="Video Format" value={data.videoFormat || ''} onChange={e => set('videoFormat', e.target.value)} placeholder="e.g. MP4, MOV" />
            <FormInput label="Video Resolution" value={data.resolution || ''} onChange={e => set('resolution', e.target.value)} placeholder="e.g. 1080p, 4K" />
          </div>
          <div className="pt-6 border-t border-foreground/10 space-y-6">
            <FormRadio label="Is the video already broadcast on television?" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value={data.onTV} onChange={v => set('onTV', v)} />
            {data.onTV === 'yes' && (
              <div className="grid md:grid-cols-2 gap-6 pl-6 border-l border-foreground/10">
                <FormInput label="TV Channel(s)" value={data.tvChannels || ''} onChange={e => set('tvChannels', e.target.value)} />
                <FormInput label="Country / Territory" value={data.tvCountry || ''} onChange={e => set('tvCountry', e.target.value)} />
                <FormInput label="Broadcast Date" type="date" value={data.broadcastDate || ''} onChange={e => set('broadcastDate', e.target.value)} />
              </div>
            )}
            <FormInput label="Target TV Channels" value={data.targetTV || ''} onChange={e => set('targetTV', e.target.value)} />
            <FormInput label="Target Countries / Territories" value={data.targetCountries || ''} onChange={e => set('targetCountries', e.target.value)} />
            <FormInput label="Preferred Broadcast Date" type="date" value={data.preferredDate || ''} onChange={e => set('preferredDate', e.target.value)} />
            <FormSelect label="Television Category" options={tvCategoryOptions} value={data.tvCategory || ''} onChange={e => set('tvCategory', e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      label: 'Uploads & Materials', shortLabel: 'Uploads',
      content: (
        <div className="space-y-6">
          <FormFile label="Upload Video Thumbnail" accept="image/*" onChange={f => set('thumbnail', f)} />
          <FormFile label="Upload Artist Photo" accept="image/*" onChange={f => set('artistPhoto', f)} />
          <FormFile label="Upload Cover Artwork" accept="image/*" onChange={f => set('coverArt', f)} />
          <FormFile label="Upload Press Release" accept=".pdf,.doc,.docx" onChange={f => set('pressRelease', f)} />
          <FormFile label="Upload EPK" accept=".pdf,.doc,.docx,.zip" onChange={f => set('epk', f)} />
          <FormFile label="Upload Additional Materials" multiple onChange={f => set('additionalMaterials', f)} />
        </div>
      ),
    },
    {
      label: 'Description & Consent', shortLabel: 'Submit',
      content: (
        <div className="space-y-6">
          <FormTextarea label="Music Video Description" required value={data.videoDescription || ''} onChange={e => set('videoDescription', e.target.value)} />
          <FormTextarea label="Artist Biography" value={data.biography || ''} onChange={e => set('biography', e.target.value)} />
          <FormTextarea label="Director's Statement" value={data.directorStatement || ''} onChange={e => set('directorStatement', e.target.value)} />
          <FormTextarea label="Additional Information" value={data.additionalInfo || ''} onChange={e => set('additionalInfo', e.target.value)} />
          <div className="space-y-4 pt-6 border-t border-foreground/10">
            <FormCheckbox label="I confirm that I have the necessary rights and permissions to submit this music video for television and media consideration." required checked={data.consent} onChange={v => set('consent', v)} />
            <FormCheckbox label="I authorize MH Entertainment to contact me regarding television, media, and promotional opportunities." checked={data.newsletter} onChange={v => set('newsletter', v)} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title="TV MUSIC VIDEO SUBMISSION"
      intro="Submit your official music video for consideration by MH Entertainment and its television and media partners."
      success={success}
      successMessage="Thank you. Your music video has been successfully submitted to MH Entertainment for television and media consideration."
    >
      <MultiStepForm steps={steps} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="SUBMIT MUSIC VIDEO" />
    </FormLayout>
  );
}
