import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const categoryOptions = [
    { value: 'general', label: 'General Discussion' },
    { value: 'business-tips', label: 'Business Tips' },
    { value: 'success-stories', label: 'Success Stories' },
    { value: 'qa', label: 'Q&A' },
    { value: 'local-events', label: 'Local Events' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'content') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        timestamp: new Date(),
        id: Date.now() // Mock ID
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        attachments: []
      });
      setCharCount(0);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1002 p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Create New Post
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <Input
            label="Post Title"
            type="text"
            placeholder="What would you like to discuss?"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
            maxLength={100}
          />

          {/* Category */}
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Select a category"
            required
          />

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content *
            </label>
            <textarea
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              required
              rows={6}
              maxLength={2000}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </span>
              <span className={`text-xs ${charCount > 1800 ? 'text-warning' : 'text-muted-foreground'}`}>
                {charCount}/2000
              </span>
            </div>
          </div>

          {/* Tags */}
          <Input
            label="Tags (optional)"
            type="text"
            placeholder="business, marketing, startup (comma separated)"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            description="Add relevant tags to help others find your post"
          />

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Attachments (optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Icon name="Upload" size={24} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">
                  Click to upload images or documents
                  <br />
                  <span className="text-xs">Max 5MB per file</span>
                </span>
              </label>
            </div>

            {/* Attachment List */}
            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      iconName="X"
                      onClick={() => removeAttachment(index)}
                      className="text-muted-foreground hover:text-error"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offline Notice */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Wifi" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  Offline Mode Active
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your post will be saved as a draft and published when you're back online.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Posts are reviewed by moderators before publishing</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              disabled={!formData.title.trim() || !formData.content.trim() || !formData.category || charCount < 10}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;