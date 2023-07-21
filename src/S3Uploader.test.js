import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import S3Uploader from './S3Uploader';

describe('S3Uploader', () => {
  it('uploads "Hello, World!" to S3 when the button is clicked', () => {
    render(<S3Uploader />);
  
    fireEvent.click(screen.getByText('Upload to S3'));

    // Assert that the upload was successful
    expect(screen.getByText('Successfully uploaded to S3:')).toBeInTheDocument();
  });
});
