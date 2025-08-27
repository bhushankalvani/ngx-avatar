# ngx-avatar-2

[![npm version](https://badge.fury.io/js/ngx-avatar-2.svg)](https://badge.fury.io/js/ngx-avatar-2)
[![Angular](https://img.shields.io/badge/Angular-18%2B-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2%2B-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A universal avatar component for Angular applications that fetches and generates avatars based on user information. Features a robust fallback system that automatically tries alternative sources when the primary source fails.

**Angular 18 Ready**: Built with modern Angular features including the new application builder, improved performance, and ESLint integration.

## Features

- **Multiple Avatar Sources**: Facebook, Google, Twitter, Instagram, VKontakte, GitHub, Gravatar, and more
- **Smart Fallback System**: Automatically tries alternative sources if the primary source fails
- **Text-Based Avatars**: Generate initials from names or display custom values
- **Highly Customizable**: Control colors, sizes, shapes, and styling
- **Angular 18 Support**: Built with standalone components, OnPush change detection, and modern control flow syntax
- **TypeScript**: Full type safety and excellent IntelliSense support
- **Performance Optimized**: Efficient change detection and lazy loading

![Angular Avatar component preview](https://github.com/bhushankalvani/ngx-avatar/blob/main/demo.png)



### Supported Avatar Sources

The component supports multiple avatar sources with automatic fallback:

1. **Facebook** (highest priority)
2. **Google**
3. **Twitter** ⚠️ *Deprecated - may not work reliably*
4. **Instagram**
5. **Vkontakte (VK)**
6. **Gravatar**
7. **GitHub**
8. **Custom image**
9. **Name initials**
10. **Custom value**

### Demo and Resources

- Live Demo: Coming soon for Angular 18 version
- Interactive Playground: Coming soon for Angular 18 version

## Installation

```bash
npm install ngx-avatar-2
```

## Compatibility

| ngx-avatar-2 | Angular | Node.js | TypeScript |
|-------------|---------|---------|------------|
| 5.x         | 17.x    | >=18.13 | >=5.2      |
| 4.x         | 16.x    | >=16.0  | >=4.9      |

For Angular 16 support, use version 4.x. For Angular 17, use version 5.0.x. For Angular 18+, use version 5.1.x.

## Usage

### Module Import

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar-2';

@NgModule({
  imports: [
    HttpClientModule, // Required for external avatar sources
    AvatarModule
  ]
})
export class AppModule { }
```

### Standalone Component (Angular 18+)

```typescript
import { Component } from '@angular/core';
import { AvatarComponent } from 'ngx-avatar-2';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AvatarComponent],
  template: '<ngx-avatar name="John Doe"></ngx-avatar>'
})
export class ExampleComponent { }
```

### HTTP Client Setup

For external avatar sources (Gravatar, Google, etc.), you need to provide HttpClient:

**Angular 18+ (Recommended):**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // other providers...
  ]
});
```

**Traditional NgModule:**
```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule, // Required for external avatar sources
    AvatarModule
  ]
})
export class AppModule { }
```

> **Optional**: For better Gravatar hash support, install `ts-md5`: `npm install ts-md5`. The component works without it using a fallback hash function.
## Examples

```html
<ngx-avatar facebookId="1508319875"></ngx-avatar>
<ngx-avatar googleId="1508319875"></ngx-avatar>
<ngx-avatar twitterId="1508319875"></ngx-avatar> <!-- ⚠️ Twitter may not work reliably -->
<ngx-avatar instagramId="dccomics" size="70"></ngx-avatar>
<ngx-avatar gravatarId="fd05dbe73d9aef2e2ae8910f08c512"></ngx-avatar>
<ngx-avatar gravatarId="user@gmail.com"></ngx-avatar>
<ngx-avatar src="assets/avatar.jpg"></ngx-avatar>
<ngx-avatar name="John Doe"></ngx-avatar>
<ngx-avatar value="75%"></ngx-avatar>

<ngx-avatar facebookId="userFacebookID" 
 googleId="google" name="Bhushan Kalvani" src="assets/avatar.jpg"
 value="28%"  twitterId="twitter" <!-- ⚠️ Twitter deprecated -->
 gravatarId="fd05dbe73d9aef2e2ae8910f08c512" 
 size="100" [round]="true">
</ngx-avatar>

```
Check out the demo folder in this repository for more examples on how to use ngx-avatar-2 in your application.

## Demo
Live demo and interactive playground coming soon for the Angular 18 version.

Moreover, the demo folder contains an application generated with angular cli that uses ngx-avatar component.

To run the demo application:

```bash
npm install
ng serve
```

## API Reference\n\n### Component Inputs

|   Attribute   |      Type        | Default |                                              Description                                               |
| ------------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `facebookId`  | *string \| null* |         | Facebook ID                                                                                            |
| `googleId`    | *string \| null* |         |  Google ID                                                                                             |
| `twitterId`   | *string \| null* |         | Twitter Handle ⚠️ **Deprecated: May not work reliably due to X/Twitter API changes**                  |
| `instagramId`   | *string \| null* |         | Instagram Handle                                                                                         |
| `vkontakteId` | *string \| null* |         | VK ID                                                                                                  |
| `gravatarId`  | *string \| null* |         | email or md5 email related to gravatar                                                                 |
| `githubId`    | *string \| null* |         | Github ID                                                                                              |
| `src`         | *string \| null* |         | Fallback image to use                                                                                  |
| `name`        | *string \| null* |         | Will be used to generate avatar based on the initials of the person                                    |
| `value`       | *string \| null* |         | Show a value as avatar                                                                                 |
| `initialsSize`| *number*         | 0       | Restricts the size of initials - it goes along with the name property and can be used to fix the number of characters that will be displayed as initials. The `0` means no restrictions. |
| `bgColor`     | *string*         | random  | Give the background a fixed color with a hex like for example #FF0000                                  |
| `fgColor`     | *string*         | #FFF    | Give the text a fixed color with a hex like for example #FF0000                                        |
| `size`        | *number*         | 50      | Size of the avatar                                                                                     |
| `textSizeRatio`| *number*        | 3       | For text based avatars the size of the text as a fragment of size (size / textSizeRatio)               |
| `round`       | *boolean*        | true    | Round the avatar corners                                                                               |
| `cornerRadius`| *number*         | 0       | Square avatars can have rounded corners using this property                                            |
| `borderColor` | *string*         | undefined | Add border with the given color. boder's default style is '1px solid borderColor'                    |
| `style`       | *object*         |         | Style that will be applied on the root element                                                         |

### Accessibility Inputs

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `alt` | *string* | auto-generated | Custom alt text for avatar images |
| `ariaLabel` | *string* | auto-generated | Custom ARIA label for screen readers |
| `role` | *string* | 'img' | ARIA role attribute |
| `clickable` | *boolean* | false | Makes avatar focusable and enables keyboard navigation |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `clickOnAvatar` | `Source` | Fired when avatar is clicked, emits the source object |

The source object contains:
- `sourceType`: Avatar source (Facebook, Twitter, etc.)
- `sourceId`: User identifier  
- `getAvatar(size)`: Method to fetch avatar from current source

## Configuration

### Custom Colors and Source Priority

The AvatarModule can be configured using the `forRoot()` method to customize default behaviors:

- **avatarColors**: Override default colors for text-based avatars
- **sourcePriorityOrder**: Change the order of avatar source fallbacks

### Custom Source Priority Order

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { UserService } from "./user.service";
import { AvatarModule, AvatarSource } from 'ngx-avatar-2';

const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];

@NgModule({
  declarations: [
    AppComponent  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // import AvatarModule in your app with your own configuration
    AvatarModule.forRoot({
      sourcePriorityOrder: avatarSourcesOrder
    })
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Custom Avatar Colors

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserService } from "./user.service";
import { AvatarModule } from "ngx-avatar-2";
import { HttpClientModule } from "@angular/common/http";

const avatarColors = ["#FFB6C1", "#2c3e50", "#95a5a6", "#f39c12", "#1abc9c"];

@NgModule({
  declarations: [
    AppComponent  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // import AvatarModule in your app with your own configuration
    AvatarModule.forRoot({
      colors: avatarColors
    })
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Legacy Configuration (< v3.1)

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserService } from "./user.service";
import { AvatarModule,AvatarConfig } from "ngx-avatar-2";
import { HttpClientModule } from "@angular/common/http";

const avatarConfig = new AvatarConfig(['red','blue','pink']);

@NgModule({
  declarations: [
    AppComponent  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // import AvatarModule in your app with your own configuration
    AvatarModule.forRoot(avatarConfig)
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

## Styling

The component provides CSS classes for custom styling:

- **`.avatar-container`**: The host element (applied to all avatar types)
- **`.avatar-content`**: The inner avatar element

### Custom CSS Example

```html
<ngx-avatar class="my-avatar" value="HM"></ngx-avatar>
```

```css
.my-avatar ::ng-deep .avatar-content {
    background-color: red !important;
}
```

## Release Notes & History
* 5.1.0: Angular 18 support (requires Angular 18+). For Angular 17, use version 5.0.x
* 5.0.0: Angular 17 support with standalone components, OnPush change detection, modern control flow syntax (@if/@else), new application builder, ESLint migration, optional ts-md5 dependency, performance improvements, removed support for deprecated platforms (Skype), and marked Twitter source as deprecated due to X/Twitter API changes
* 4.2.3: Angular 16.0.0 set as base version for compatibility to any Angular 16 projects. 
* 4.2.2: Angular 16 support **breaking changes (ivy compiler becomes default)**
* 4.1.9: Angular 15 support
* 4.1.8: Angular 14 support
* 4.1.0: Angular 11 support
* 4.0.0: Angular 9 support and minor improvements
* 3.6.0: Angular 8 support
* 3.5.0: export Avatar component for Angular elements and ng upgrade
* 3.4.0: http module is removed from the library dependencies. Applications' http module will be used instead.
* 3.3.x: Bug fixes
* 3.3.0: Override Source priority order when importing AvatarModule
* 3.2.0: Add support to Angular 7
* 3.1.1: fixes the source priority bug 
* 3.1: fixes AOT / Prod build when loading avatar module with config
  * This version has a **breaking change** in the way the module with configuration is imported, for more details see Override Avatar Configuration section. 
* 3.0: Add support to Angular 6
  * Build the library with Angular CLI
* 2.9: Bug fixes [#16](https://github.com/HaithemMosbahi/ngx-avatar/issues/16) & [#16](https://github.com/HaithemMosbahi/ngx-avatar/issues/16)
* 2.8: add initials size option
* 2.7: code refactoring
* 2.6: Customize avatar options
* 2.5: Bug fixes & new css classes
* 2.4: Refactor async sources
* 2.3: Add support for github avatar
* 2.2: Fix prod and aot build
* 2.1: Bug fixes
* 2.0: add support to vkontakte source
* 1.4: background color is now generated based on the sum of ASCII values of avatar's text.
* 1.3: Bug Fixes ( support dynamic avatar data )
* 1.2: Add border related properties.
* 1.1: Listen to click events on avatar and support retina display.
* 1.0: Avatar component that fetches / generates user avatar from different sources.


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request


## Development

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

### Building

```bash
# Build demo application  
ng build

# Build library
ng build ngx-avatar-2
```

### Testing

```bash
# Run unit tests
ng test

# Run library tests
ng test ngx-avatar-2
```

### Code Generation

```bash
ng generate component component-name
```

This project was built with [Angular CLI](https://github.com/angular/angular-cli) and upgraded to Angular 18.

## License

MIT License
maintained by [Bhushan Kalvani](mailto:contact@galekt.com)

**Note**: This package was forked from the original ngx-avatar by Haithem Mosbahi and has been maintained completely separately since Angular 15. From the Angular 17 upgrade onwards, it is totally independent with its own development path and improvements.
