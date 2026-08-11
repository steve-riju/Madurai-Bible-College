import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Profile } from '../../models/profile.model';
import { PROFILES } from '../../data/profiles';
import { COLLEGE_INFO } from '../../data/college-info';

import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  profile: Profile | null = null;

  college = COLLEGE_INFO;

  showSplash = true;

  profileNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.profileNotFound = true;
      this.showSplash = false;
      this.setNotFoundSeo();
      return;
    }

    // =========================================================
    // FIND PROFILE
    // =========================================================

    this.profile =
      PROFILES.find(
        profile =>
          profile.slug === slug
      ) ?? null;


    // =========================================================
    // PROFILE NOT FOUND
    // =========================================================

    if (!this.profile) {

      this.profileNotFound =
        true;

      this.setNotFoundSeo();

    }

    // =========================================================
    // PROFILE FOUND
    // =========================================================

    else {

      this.setSeoMetadata();

    }

    /*
     * MBC intro animation
     *
     * The profile is already loaded underneath.
     * Only the splash is visible for 3 seconds.
     */
    setTimeout(() => {
      this.showSplash = false;
    }, 3000);
  }

  get isStudent(): boolean {
    return this.profile?.type === 'STUDENT';
  }

  get isStaff(): boolean {
    return this.profile?.type === 'STAFF';
  }

  get statusLabel(): string {

    if (!this.profile) {
      return '';
    }

    switch (this.profile.status) {

      case 'ACTIVE':
        return this.isStudent
          ? 'Active Student'
          : 'Active Staff';

      case 'GRADUATED':
        return 'Graduated';

      case 'ALUMNI':
        return 'Alumni';

      case 'INACTIVE':
        return 'Inactive';

      case 'FORMER_STAFF':
        return 'Former Staff';

      default:
        return '';
    }
  }

  private setSeoMetadata(): void {

  if (!this.profile) {
    return;
  }

  const profileName = this.profile.name;

  const role = this.isStudent
    ? this.profile.course
    : this.profile.designation;

  const pageTitle =
    `${profileName} | ${role} | Madurai Bible College`;

  const description =
    `Official profile of ${profileName}, ${role} at Madurai Bible College.`;

  const profileUrl =
    `https://id.campusmbc.org/profile/${this.profile.slug}`;

  const imageUrl =
    new URL(
      this.profile.photo,
      this.document.baseURI
    ).href;


  /* =====================================================
     TITLE
     ===================================================== */

  this.title.setTitle(pageTitle);


  /* =====================================================
     STANDARD SEO
     ===================================================== */

  this.meta.updateTag({
    name: 'description',
    content: description
  });


  this.meta.updateTag({
    name: 'robots',
    content: 'index, follow'
  });


  /* =====================================================
     OPEN GRAPH
     ===================================================== */

  this.meta.updateTag({
    property: 'og:title',
    content: pageTitle
  });


  this.meta.updateTag({
    property: 'og:description',
    content: description
  });


  this.meta.updateTag({
    property: 'og:type',
    content: 'profile'
  });


  this.meta.updateTag({
    property: 'og:url',
    content: profileUrl
  });


  this.meta.updateTag({
    property: 'og:image',
    content: imageUrl
  });


  this.meta.updateTag({
    property: 'og:site_name',
    content: 'Madurai Bible College'
  });


  /* =====================================================
     TWITTER / X
     ===================================================== */

  this.meta.updateTag({
    name: 'twitter:card',
    content: 'summary_large_image'
  });


  this.meta.updateTag({
    name: 'twitter:title',
    content: pageTitle
  });


  this.meta.updateTag({
    name: 'twitter:description',
    content: description
  });


  this.meta.updateTag({
    name: 'twitter:image',
    content: imageUrl
  });


  /* =====================================================
     CANONICAL
     ===================================================== */

  let canonical =
    this.document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;


  if (!canonical) {

    canonical =
      this.document.createElement('link');

    canonical.rel = 'canonical';

    this.document.head.appendChild(canonical);
  }


  canonical.href = profileUrl;
}
// =========================================================
  // NOT FOUND SEO
  // =========================================================

  private setNotFoundSeo(): void {

    const pageTitle =
      'Profile Not Found | Madurai Bible College';


    const description =
      'The requested profile could not be found at Madurai Bible College.';


    // =========================================================
    // TITLE
    // =========================================================

    this.title.setTitle(
      pageTitle
    );


    // =========================================================
    // DESCRIPTION
    // =========================================================

    this.meta.updateTag({

      name:
        'description',

      content:
        description

    });


    // =========================================================
    // DO NOT INDEX
    // =========================================================

    this.meta.updateTag({

      name:
        'robots',

      content:
        'noindex, nofollow, noarchive'

    });


    // =========================================================
    // OPEN GRAPH
    // =========================================================

    this.meta.updateTag({

      property:
        'og:title',

      content:
        pageTitle

    });


    this.meta.updateTag({

      property:
        'og:description',

      content:
        description

    });


    this.meta.updateTag({

      property:
        'og:type',

      content:
        'website'

    });


    this.meta.updateTag({

      property:
        'og:site_name',

      content:
        'Madurai Bible College'

    });
  }
}