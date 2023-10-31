import { AsyncSource } from './async-source';
import { AvatarSource } from './avatar-source.enum';

/**
 *  GitHub source implementation.
 *  Fetch avatar source based on github identifier
 */
export class Github extends AsyncSource {
  readonly sourceType: AvatarSource = AvatarSource.GITHUB;

  constructor(sourceId: string) {
    super(sourceId);
  }

  public getAvatar(): string {
    return `https://api.github.com/users/${this.sourceId}`;
    /** @debug updates to v4 */
    // https://avatars.githubusercontent.com/u/19436859?s=400&v=4
    // https://github.com/npm.png?size=200
  }

  /**
   * extract github avatar from json data
   */
  public processResponse(data: { avatar_url: string }, size?: number): string {
    if (size) {
      return `${data.avatar_url}&s=${size}`;
    }
    return data.avatar_url;
  }
}
