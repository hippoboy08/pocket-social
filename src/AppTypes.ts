export namespace Pocket {
  export interface UserProfile {
    firstName: string
    lastName: string
    dob: Date
    bio: string
    profession: string
    nationality: string
    photoUrl: string
  }
  export enum RecordType {
    phone = 'Phone',
    facebook = 'Facebook',
    url = 'Url',
    email = 'Email',
    instagram = 'Instagram',
    linkedin = 'LinkedIn',
    telegram = 'Telegram',
    discord = 'Discord',
    github = 'Github',
    snapchat = 'Snapchat',
    twitter = 'Twitter',
    whatsapp = 'Whatsapp',
    youtube = 'Youtube',
  }
  const Icons = {
    [RecordType.phone]: 'phone_iphone',
    [RecordType.facebook]: 'facebook',
    [RecordType.url]: 'sharethis',
    [RecordType.email]: 'email',
    [RecordType.instagram] : 'instagram',
    [RecordType.linkedin] : 'linkedin',
    [RecordType.telegram] : 'telegram',
    [RecordType.discord] : 'discord',
    [RecordType.github] : 'github',
    [RecordType.snapchat] : 'snapchat',
    [RecordType.twitter] : 'twitter',
    [RecordType.whatsapp] : 'whatsapp',
    [RecordType.youtube] : 'youtube',
  }
  /** Return the icon name corresponding with the RecordType. */
  export const RecordIcon = (recordType: RecordType = RecordType.url) => {
    return Icons[recordType]
  }

  export class Link {
    value: string = ''
    type: RecordType = RecordType.url

    constructor(link: Partial<Link> = { value: '', type: RecordType.url }) {
      if (link) Object.assign(this, link)
    }
    public get actionLink(): string {
      switch (this.type) {
        case RecordType.phone: {
          return `tel:${this.value}`
        }
        case RecordType.email: {
          return `mailto:${this.value}`
        }
        default:
          return this.value
      }
    }
  }
  export class Record {
    public id: string = ''
    public type: RecordType = RecordType.url
    public description: string = ''
    public links: Link[] = [new Link({ value: '' })]
    public isPublic: boolean = true
    public userId: string = ''

    constructor(record?: Partial<Record>) {
      if (record) {
        Object.assign(this, record)
        this.links =
          record.links?.map(
            (link) => new Link({ value: link.value, type: this.type })
          ) ?? this.links
      }
    }
  }
}
export default Pocket
