export interface QuoteItem {
  id: string;
  text: string;
  value?: number;
}

export interface QuoteData {
  headerImage: string | null;
  footerImage: string | null;
  clientName: string;
  services: QuoteItem[];
  observations: QuoteItem[];
  details: QuoteItem[];
  backgroundImage: string | null;
  backgroundOpacity: number;
  fontFamily: string;
  textColor: string;
  headerType: 'image' | 'template';
  footerType: 'image' | 'template';
  companyName: string;
  email: string;
  phone: string;
  companyLogo: string | null;
}
