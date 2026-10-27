export interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  grantName: string;
  amount: string;
  rating: number;
  date: string;
  avatar: string;
  title: string;
  content: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Marcus Sterling',
    role: 'Homeowner & Family Head',
    location: 'Atlanta, GA',
    grantName: 'Personal Housing & Rent Relief Assistance Grant',
    amount: '$32,500 Awarded',
    rating: 5,
    date: '2 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Saved our family home during our darkest hour',
    content: 'When our family was hit with unexpected medical bills and facing imminent eviction, we had no idea individual grants existed for ordinary citizens. EastAidGrant walked us through the application in 15 minutes. Within 3 weeks, we were approved for $32,500 that kept our home secure. Truly life-saving support.',
    verified: true,
  },
  {
    id: 'r2',
    name: 'Elena Rostova-Davis',
    role: 'Undergraduate Student',
    location: 'Chicago, IL',
    grantName: 'Individual Higher Education & Tuition Grant',
    amount: '$45,000 Awarded',
    rating: 5,
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Graduating college completely debt-free',
    content: 'As a first-generation student working two night jobs, I was exhausted and on the verge of dropping out before my senior year. This grant covered my entire remaining tuition and laboratory certification costs. I am graduating debt-free this spring thanks to EastAidGrant.',
    verified: true,
  },
  {
    id: 'r3',
    name: 'Sgt. David Washington',
    role: 'U.S. Army Veteran',
    location: 'Dallas, TX',
    grantName: 'Individual Veteran Personal Transition Grant',
    amount: '$40,000 Awarded',
    rating: 5,
    date: '3 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Real transition funding that actually reached me',
    content: 'Transitioning out of active military service was much harder than anticipated. Federal agency bureaucracy felt like an endless maze, but EastAidGrant made discovering and submitting our veteran hardship documentation fast and clear. Received $40,000 to relocate and buy tools for my new trade. Total respect.',
    verified: true,
  },
  {
    id: 'r4',
    name: 'Kendra Jenkins',
    role: 'Single Mother of Two',
    location: 'Charlotte, NC',
    grantName: 'Single Parent Family Emergency Grant',
    amount: '$28,000 Awarded',
    rating: 5,
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Peace of mind and child care secured',
    content: 'When my car transmission failed, I was terrified of losing my job and being unable to get my children to school. This emergency family grant came through with $28,000 directly to our account. It covered reliable transport and six months of licensed childcare. I cried tears of pure relief.',
    verified: true,
  },
  {
    id: 'r5',
    name: 'Julian Vance',
    role: 'Independent Filmmaker',
    location: 'Denver, CO',
    grantName: 'Individual Artist & Creative Fellowship Grant',
    amount: '$25,000 Awarded',
    rating: 5,
    date: '2 months ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Non-repayable stipend that funded my documentary',
    content: 'Independent visual creators rarely get grants without established non-profit sponsors taking a cut. EastAidGrant listed direct individual fellowships with zero middlemen. The funds went directly to my production equipment and post-production editing. My documentary premiered last week.',
    verified: true,
  },
  {
    id: 'r6',
    name: 'Dr. Rachel Patel, MD',
    role: 'Clinic Director',
    location: 'Pittsburgh, PA',
    grantName: 'Rural Hospital & Medical Equipment Grant',
    amount: '$150,000 Awarded',
    rating: 5,
    date: '2 months ago',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Transformative funding for underserved patients',
    content: 'Our regional medical center desperately needed modern cardiac monitoring equipment. EastAidGrant connected us directly with healthcare allocation grants we would have never found on government portals. The entire intake review was seamless and completely legitimate.',
    verified: true,
  },
];
