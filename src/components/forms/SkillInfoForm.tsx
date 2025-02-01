'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SkillInfo } from '@/types/auth';

const schema = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

interface Props {
  onSubmit: (data: SkillInfo) => void;
  loading: boolean;
}

export default function SkillInfoForm({ onSubmit, loading }: Props) {
  const [verificationVideo, setVerificationVideo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<SkillInfo>({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: [],
    },
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('Video size should be less than 50MB');
        return;
      }
      setVerificationVideo(file);
      setError('');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      if (!selectedSkills.includes(skillInput.trim())) {
        setSelectedSkills([...selectedSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleFormSubmit = () => {
    if (!verificationVideo) {
      setError('Please upload a verification video');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('Please add at least one skill');
      return;
    }
    onSubmit({
      skills: selectedSkills,
      verificationVideo,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm hover:bg-gray-100"
          >
            Add
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
              >
                <span className="sr-only">Remove {skill}</span>
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.skills && (
          <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="verificationVideo" className="block text-sm font-medium text-gray-700">
          Upload Verification Video
        </label>
        <input
          type="file"
          id="verificationVideo"
          accept="video/*"
          onChange={handleVideoChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {verificationVideo && (
          <p className="mt-1 text-sm text-gray-500">
            Selected video: {verificationVideo.name}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Please upload a video demonstrating your skills (max 50MB)
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
} 