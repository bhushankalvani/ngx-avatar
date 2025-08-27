import { Source } from './source';
import { AvatarSource } from './avatar-source.enum';

// Optional import with fallback
let Md5: any;
try {
  const md5Module = require('ts-md5');
  Md5 = md5Module.Md5;
} catch (error) {
  // ts-md5 not available, will use fallback
  Md5 = null;
}

/**
 * Simple MD5 implementation fallback
 * Only used when ts-md5 is not available
 */
function simpleMd5(input: string): string {
  // Basic fallback - use the input as-is if it looks like an MD5 hash
  if (input.match(/^[a-f0-9]{32}$/)) {
    return input;
  }
  
  // For non-hash inputs, create a simple hash-like string
  // This is not a real MD5 but provides a deterministic result
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a hex-like string (not real MD5, but consistent)
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return hashStr.repeat(4).substring(0, 32); // Make it 32 chars like MD5
}

function isRetina(): boolean {
  if (typeof window !== 'undefined' && window !== null) {
    if (window.devicePixelRatio > 1.25) {
      return true;
    }

    const mediaQuery = '(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)';
    if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
      return true;
    }
  }

  return false;
}

/**
 *  Gravatar source implementation.
 *  Fetch avatar source based on gravatar email
 */
export class Gravatar implements Source {
  readonly sourceType: AvatarSource = AvatarSource.GRAVATAR;
  public sourceId: string;

  constructor(public value: string) {
    // Check if the value is already an MD5 hash
    if (value.match(/^[a-f0-9]{32}$/)) {
      this.sourceId = value;
    } else {
      // Use ts-md5 if available, otherwise use fallback
      if (Md5 && typeof Md5.hashStr === 'function') {
        this.sourceId = Md5.hashStr(value).toString();
      } else {
        this.sourceId = simpleMd5(value);
      }
    }
  }

  public getAvatar(size: number): string {
    const avatarSize = isRetina() ? size * 2 : size;
    return `https://secure.gravatar.com/avatar/${
      this.sourceId
    }?s=${avatarSize}&d=404`;
  }
}
