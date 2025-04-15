/**
 * Facade Design Pattern
 *
 * The Facade pattern provides a simplified interface to a complex subsystem.
 * It doesn't hide the subsystem but provides a unified interface to make the subsystem
 * easier to use by reducing complexity and minimizing the communication and dependencies
 * between subsystems and clients.
 */

/**
 * Complex Video File Subsystem
 * These are the complex subsystem components that the facade will simplify.
 */

// Video File class represents a video file with its metadata
class VideoFile {
  constructor(filename) {
    this.filename = filename;
    this.format = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
  }

  getFilename() {
    return this.filename;
  }

  getFormat() {
    return this.format;
  }
}

// Audio Mixer - Handles audio extraction and processing
class AudioMixer {
  /**
   * Extracts audio from a video file
   * @param {VideoFile} file - The video file
   * @returns {string} - Extracted audio data
   */
  extractAudio(file) {
    console.log(`Extracting audio from ${file.getFilename()}`);
    return `Audio data from ${file.getFilename()}`;
  }

  /**
   * Mixes multiple audio streams
   * @param {Array} audioData - Array of audio data
   * @returns {string} - Mixed audio
   */
  mix(audioData) {
    console.log(`Mixing audio streams: ${audioData}`);
    return 'Mixed audio data';
  }

  /**
   * Adjusts audio quality
   * @param {string} audio - Audio data
   * @param {number} quality - Quality setting (0-100)
   * @returns {string} - Adjusted audio
   */
  adjustQuality(audio, quality) {
    console.log(`Adjusting audio quality to ${quality}%`);
    return `${audio} (Quality: ${quality}%)`;
  }
}

// Bitrate Converter - Handles video bitrate conversion
class BitrateConverter {
  /**
   * Reads the bitrate of a video file
   * @param {VideoFile} file - The video file
   * @returns {number} - The bitrate in Mbps
   */
  readBitrate(file) {
    console.log(`Reading bitrate from ${file.getFilename()}`);
    // Simulate different bitrates for different formats
    const bitrates = {
      mp4: 8,
      avi: 6,
      mkv: 10,
      mov: 7,
    };
    return bitrates[file.getFormat()] || 5;
  }

  /**
   * Converts video to a specific bitrate
   * @param {VideoFile} file - The video file
   * @param {number} targetBitrate - Target bitrate in Mbps
   * @returns {string} - Converted video data
   */
  convert(file, targetBitrate) {
    const currentBitrate = this.readBitrate(file);
    console.log(
      `Converting ${file.getFilename()} from ${currentBitrate}Mbps to ${targetBitrate}Mbps`
    );
    return `Converted data for ${file.getFilename()} at ${targetBitrate}Mbps`;
  }
}

// Codec Factory - Creates codecs for different video formats
class CodecFactory {
  /**
   * Creates the appropriate codec for a video file
   * @param {VideoFile} file - The video file
   * @returns {Codec} - The appropriate codec
   */
  createCodec(file) {
    const format = file.getFormat();
    console.log(`Creating codec for ${format} format`);

    switch (format) {
      case 'mp4':
        return new MPEG4Codec();
      case 'avi':
        return new AVICodec();
      case 'mkv':
        return new MKVCodec();
      case 'mov':
        return new MOVCodec();
      default:
        console.log(`Unknown format: ${format}, using default codec`);
        return new OGGCodec();
    }
  }
}

// Various Codec classes
class Codec {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  /**
   * Decodes video data
   * @param {VideoFile} file - The video file
   * @returns {string} - Decoded video data
   */
  decode(file) {
    console.log(`Decoding ${file.getFilename()} using ${this.name} codec`);
    return `Decoded ${file.getFilename()} data`;
  }

  /**
   * Encodes video data to this codec format
   * @param {string} data - Video data
   * @param {string} targetFormat - Target format
   * @returns {string} - Encoded video data
   */
  encode(data, targetFormat) {
    console.log(`Encoding data to ${targetFormat} format using ${this.name} codec`);
    return `${data} encoded to ${targetFormat}`;
  }
}

// Concrete codec implementations
class MPEG4Codec extends Codec {
  constructor() {
    super('MPEG4');
  }
}

class AVICodec extends Codec {
  constructor() {
    super('AVI');
  }
}

class MKVCodec extends Codec {
  constructor() {
    super('MKV');
  }
}

class MOVCodec extends Codec {
  constructor() {
    super('MOV');
  }
}

class OGGCodec extends Codec {
  constructor() {
    super('OGG');
  }
}

// VideoEditor - Handles video editing operations
class VideoEditor {
  /**
   * Adds a filter to video data
   * @param {string} videoData - Video data
   * @param {string} filter - Filter name
   * @returns {string} - Video data with filter applied
   */
  addFilter(videoData, filter) {
    console.log(`Adding ${filter} filter to video`);
    return `${videoData} with ${filter} filter`;
  }

  /**
   * Trims video to specific start and end times
   * @param {string} videoData - Video data
   * @param {number} start - Start time in seconds
   * @param {number} end - End time in seconds
   * @returns {string} - Trimmed video data
   */
  trim(videoData, start, end) {
    console.log(`Trimming video from ${start}s to ${end}s`);
    return `${videoData} trimmed (${start}s-${end}s)`;
  }

  /**
   * Adjusts video brightness
   * @param {string} videoData - Video data
   * @param {number} brightness - Brightness level (-100 to 100)
   * @returns {string} - Video with adjusted brightness
   */
  adjustBrightness(videoData, brightness) {
    console.log(`Adjusting video brightness to ${brightness}`);
    return `${videoData} with brightness ${brightness}`;
  }
}

/**
 * VideoConversionFacade provides a simple interface to the complex video conversion subsystem.
 * It delegates client requests to appropriate subsystem objects and handles the workflow.
 */
class VideoConversionFacade {
  /**
   * Converts video from one format to another
   * @param {string} filename - Input video filename
   * @param {string} targetFormat - Target format
   * @returns {string} - Converted video file information
   */
  convertVideo(filename, targetFormat) {
    console.log(`\nVideoConversionFacade: Starting conversion of ${filename} to ${targetFormat}`);

    // Create subsystem components
    const file = new VideoFile(filename);
    const codecFactory = new CodecFactory();
    const sourceCodec = codecFactory.createCodec(file);

    // If the target format is different from the source, we need a target codec
    let targetCodec;
    if (file.getFormat() !== targetFormat) {
      targetCodec = codecFactory.createCodec(new VideoFile(`dummy.${targetFormat}`));
    } else {
      targetCodec = sourceCodec;
    }

    // Decode the video
    console.log('\nDecoding phase:');
    const decodedVideoData = sourceCodec.decode(file);

    // Handle audio
    console.log('\nAudio processing phase:');
    const audioMixer = new AudioMixer();
    const audioData = audioMixer.extractAudio(file);
    const processedAudio = audioMixer.adjustQuality(audioData, 90);

    // Edit video if needed
    console.log('\nVideo editing phase:');
    const videoEditor = new VideoEditor();
    let editedVideo = decodedVideoData;
    editedVideo = videoEditor.addFilter(editedVideo, 'Auto-color correction');
    editedVideo = videoEditor.adjustBrightness(editedVideo, 5);

    // Convert bitrate
    console.log('\nBitrate conversion phase:');
    const bitrateConverter = new BitrateConverter();
    const convertedVideo = bitrateConverter.convert(file, 8); // Standard 8Mbps

    // Encode to target format
    console.log('\nEncoding phase:');
    const encodedVideo = targetCodec.encode(editedVideo, targetFormat);

    // Finalize and create result
    const outputFilename = `${filename.substring(0, filename.lastIndexOf('.'))}.${targetFormat}`;
    console.log(`\nVideoConversionFacade: Conversion completed - ${outputFilename}`);

    return outputFilename;
  }

  /**
   * Simplified method to extract audio from a video
   * @param {string} filename - Input video filename
   * @returns {string} - Extracted audio information
   */
  extractAudioFromVideo(filename) {
    console.log(`\nVideoConversionFacade: Extracting audio from ${filename}`);

    const file = new VideoFile(filename);
    const audioMixer = new AudioMixer();
    const audioData = audioMixer.extractAudio(file);
    const processedAudio = audioMixer.adjustQuality(audioData, 95);

    const outputFilename = `${filename.substring(0, filename.lastIndexOf('.'))}.mp3`;
    console.log(`\nVideoConversionFacade: Audio extraction completed - ${outputFilename}`);

    return outputFilename;
  }

  /**
   * Simplified method to enhance video quality
   * @param {string} filename - Input video filename
   * @returns {string} - Enhanced video information
   */
  enhanceVideo(filename) {
    console.log(`\nVideoConversionFacade: Enhancing video quality for ${filename}`);

    const file = new VideoFile(filename);
    const codecFactory = new CodecFactory();
    const codec = codecFactory.createCodec(file);
    const decodedVideoData = codec.decode(file);

    const videoEditor = new VideoEditor();
    let enhancedVideo = decodedVideoData;
    enhancedVideo = videoEditor.addFilter(enhancedVideo, 'HDR Enhancement');
    enhancedVideo = videoEditor.addFilter(enhancedVideo, 'Noise Reduction');
    enhancedVideo = videoEditor.adjustBrightness(enhancedVideo, 10);

    const bitrateConverter = new BitrateConverter();
    const convertedVideo = bitrateConverter.convert(file, 12); // Higher quality 12Mbps

    const encodedVideo = codec.encode(enhancedVideo, file.getFormat());

    const outputFilename = `${filename.substring(
      0,
      filename.lastIndexOf('.')
    )}[Enhanced].${file.getFormat()}`;
    console.log(`\nVideoConversionFacade: Video enhancement completed - ${outputFilename}`);

    return outputFilename;
  }
}

/**
 * Client code - demonstrates how to use the facade
 */
function clientCode() {
  // Create the facade
  const converter = new VideoConversionFacade();

  // Perform various video operations through the facade
  console.log('CLIENT: I want to convert a video file to MP4 format.');
  const mp4Result = converter.convertVideo('wildlife.avi', 'mp4');
  console.log(`CLIENT: Great! I now have a converted file: ${mp4Result}\n`);

  console.log('CLIENT: I want to extract audio from my vacation video.');
  const audioResult = converter.extractAudioFromVideo('vacation.mkv');
  console.log(`CLIENT: Perfect! I now have the audio track: ${audioResult}\n`);

  console.log('CLIENT: Can you enhance the quality of my presentation recording?');
  const enhancedResult = converter.enhanceVideo('presentation.mp4');
  console.log(`CLIENT: Excellent! The enhanced video is ready: ${enhancedResult}`);
}

// Run the client code
clientCode();

module.exports = {
  VideoFile,
  AudioMixer,
  BitrateConverter,
  CodecFactory,
  Codec,
  MPEG4Codec,
  AVICodec,
  MKVCodec,
  MOVCodec,
  OGGCodec,
  VideoEditor,
  VideoConversionFacade,
};
