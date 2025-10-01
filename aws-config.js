const AWS = require('aws-sdk');

// Configure AWS credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
    region: process.env.AWS_REGION || 'us-east-1'
});

// Create S3 instance
const s3 = new AWS.S3();

// S3 bucket configuration
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'telegram-clone-files';

// Helper functions for S3 operations
const s3Helper = {
    // Upload file to S3
    async uploadFile(file, fileName, folder = 'chat-files') {
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: `${folder}/${fileName}`,
                Body: file,
                ContentType: file.mimetype || 'application/octet-stream',
                ACL: 'public-read' // Make file publicly accessible
            };

            const result = await s3.upload(params).promise();
            return {
                success: true,
                url: result.Location,
                key: result.Key,
                bucket: result.Bucket
            };
        } catch (error) {
            console.error('S3 upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Delete file from S3
    async deleteFile(fileKey) {
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: fileKey
            };

            await s3.deleteObject(params).promise();
            return {
                success: true,
                message: 'File deleted successfully'
            };
        } catch (error) {
            console.error('S3 delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Get file from S3
    async getFile(fileKey) {
        try {
            try {
                const params = {
                    Bucket: BUCKET_NAME,
                    Key: fileKey
                };

                const result = await s3.getObject(params).promise();
                return {
                    success: true,
                    data: result.Body,
                    contentType: result.ContentType
                };
            } catch (error) {
                console.error('S3 get error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        } catch (error) {
            console.error('S3 get error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // List files in S3 bucket
    async listFiles(prefix = 'chat-files/') {
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Prefix: prefix,
                MaxKeys: 1000
            };

            const result = await s3.listObjectsV2(params).promise();
            return {
                success: true,
                files: result.Contents || []
            };
        } catch (error) {
            console.error('S3 list error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Generate signed URL for private file access
    async getSignedUrl(fileKey, expiresIn = 3600) {
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: fileKey,
                Expires: expiresIn
            };

            const url = await s3.getSignedUrl('getObject', params);
            return {
                success: true,
                url: url
            };
        } catch (error) {
            console.error('S3 signed URL error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

module.exports = {
    s3,
    s3Helper,
    BUCKET_NAME
};

