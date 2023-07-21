import AWS from 'aws-sdk';

const awsConfig = {
  region: 'us-east-1',
  accessKeyId: 'AKIAST3Y4RJ4SRYWA26M',
  secretAccessKey: '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'
}

AWS.config.update(awsConfig);

export default AWS;
