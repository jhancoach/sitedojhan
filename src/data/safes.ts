export interface Safe {
  map: string;
  safe: string;
  imageUrl: string;
}

// Simplified safe data extracted from Excel - all unique links
// Maps: BER (Bermuda), PUR (Purgatório), KAL (Kalahari), ALP (Alpine), NT (Nova Terra)
export const safes: Safe[] = [
  // Bermuda - 16 unique safes
  { map: 'BER', safe: 'PEAK', imageUrl: 'https://drive.google.com/uc?id=12ucIsWGuDqQFKRBlGrfklPBSnfvhNx8V' },
  { map: 'BER', safe: 'KOTA TUA', imageUrl: 'https://drive.google.com/uc?id=15pDpq_O72lAffYtAFl0T4wFhOSUiXfdI' },
  { map: 'BER', safe: 'MARS', imageUrl: 'https://drive.google.com/uc?id=1jXag5O30xtqn62NwqKqXbbvycxM8uUTK' },
  { map: 'BER', safe: 'FACTORY', imageUrl: 'https://drive.google.com/uc?id=1VpP5LHkJM2W_8lIuA8WYZLo3a1mT7tQ1' },
  { map: 'BER', safe: 'MILL', imageUrl: 'https://drive.google.com/uc?id=1AYwfReCORRgW-CFuLSwB0obXi4E7zMuM' },
  { map: 'BER', safe: 'CLOCK', imageUrl: 'https://drive.google.com/uc?id=1SCApr-fafwe1-ZIBV7AK4SIVEt-UjJ2b' },
  { map: 'BER', safe: 'HANGAR', imageUrl: 'https://drive.google.com/uc?id=1LvY_WhoSznUbZKasrprg85HxvoJdSFOa' },
  { map: 'BER', safe: 'BIMA', imageUrl: 'https://drive.google.com/uc?id=1IUQNVnzH_eHu9bZc7HSbSexpQkshy5zn' },
  { map: 'BER', safe: 'SHIPYARD', imageUrl: 'https://drive.google.com/uc?id=1N4Ryq22sy3_i6G88qZc7uUrU4BqSwf0R' },
  { map: 'BER', safe: 'BULLSEYE', imageUrl: 'https://drive.google.com/uc?id=1OM9WIZVtwAJGtkYG6NE7NXdY-DfrSm4P' },
  { map: 'BER', safe: 'KATU', imageUrl: 'https://drive.google.com/uc?id=1JKqjoizXfUbIaaprKFAmo_9V07IGxvEm' },
  { map: 'BER', safe: 'GRAVEYARD', imageUrl: 'https://drive.google.com/uc?id=1i7b8revNBOJB-JAzPjy2ZnV946eSrC94' },
  { map: 'BER', safe: 'CAPETOWN', imageUrl: 'https://drive.google.com/uc?id=1lw8IGbrXswuYw8RCETOn_biB-kKsFwHo' },
  { map: 'BER', safe: 'KERATON', imageUrl: 'https://drive.google.com/uc?id=1Xvk0SL6W3st3I0uVC78Wwse24x3GPwnt' },
  { map: 'BER', safe: 'SENTOSA', imageUrl: 'https://drive.google.com/uc?id=1B77waWwql9AlWZ4wvMAYY34BrLDRE8Ci' },
  { map: 'BER', safe: 'RIVERSIDE', imageUrl: 'https://drive.google.com/uc?id=1fqu-E9rszXq4qoALl3k6NsICTAX0yUAb' },
  
  // Purgatório - 13 unique safes
  { map: 'PUR', safe: 'BR CIMA', imageUrl: 'https://drive.google.com/uc?id=1uhmGYuvH4bT-KNSyaWWEH9FZoTkS_Axu' },
  { map: 'PUR', safe: 'GOLF', imageUrl: 'https://drive.google.com/uc?id=1j8OvGxkMJBpwXCh0UjDPq6FKumzdtGhx' },
  { map: 'PUR', safe: 'CROSSROADS', imageUrl: 'https://drive.google.com/uc?id=1oh58XD9kEzOuvhTXDTGNQnYA_iirRJNV' },
  { map: 'PUR', safe: 'BOMBEIRO', imageUrl: 'https://drive.google.com/uc?id=1Gfy6cz5OxWoMOTKioZExaEl7CJNhc3mi' },
  { map: 'PUR', safe: 'LUMBER MILL', imageUrl: 'https://drive.google.com/uc?id=1QMQuw5nRDRErsp6BKDGaVEBxm9pcSO99' },
  { map: 'PUR', safe: 'FIELDS', imageUrl: 'https://drive.google.com/uc?id=1MLxUVDp41rkfuz-woiE6yVd8K9d_4IUb' },
  { map: 'PUR', safe: 'CAMPSITE', imageUrl: 'https://drive.google.com/uc?id=1KzuoQhBFiLJnwQPtHsG25t124p-7maLs' },
  { map: 'PUR', safe: 'MARBLEWORKS', imageUrl: 'https://drive.google.com/uc?id=1oJyZoxUfawUXbtoFZ4EnCMVFXcSRo_Tt' },
  { map: 'PUR', safe: 'QUARRY', imageUrl: 'https://drive.google.com/uc?id=1VWIxLwazYRjaGnUrVCI_WhvxVpC5Qxgq' },
  { map: 'PUR', safe: 'ILHA', imageUrl: 'https://drive.google.com/uc?id=1nNNLNj1F3575NMwkFikMWxEcqM_gR5lJ' },
  { map: 'PUR', safe: 'MT VILLA', imageUrl: 'https://drive.google.com/uc?id=1WPy5Xfe1agpEBEFYriY_iCfvta0RkNNM' },
  { map: 'PUR', safe: 'CENTRAL', imageUrl: 'https://drive.google.com/uc?id=1bOHOBIYK4AI4H1sfGuJeFWB610QvCktY' },
  { map: 'PUR', safe: 'BR BAIXO', imageUrl: 'https://drive.google.com/uc?id=1WdSMyU-qjnAdUvGCo3S_zDxyQZHvO9Yr' },
  
  // Kalahari - 9 unique safes
  { map: 'KAL', safe: 'SUBMARINO', imageUrl: 'https://drive.google.com/uc?id=11To71d1R6Xr1fPhhybYZ51MJN3WvFFf0' },
  { map: 'KAL', safe: 'PLAYGROUND', imageUrl: 'https://drive.google.com/uc?id=1YiNm0wLU_WD_NdrFKV2SDvF_FZ1yEbN0' },
  { map: 'KAL', safe: 'PEDRA DO BAÚ', imageUrl: 'https://drive.google.com/uc?id=1okgEGMxNGv6DcLdbIMmk6mW0X6AEvSPl' },
  { map: 'KAL', safe: 'P COMANDO', imageUrl: 'https://drive.google.com/uc?id=17nfAxXJkPq4fGg1nuh3BEd7Nuttp2ybx' },
  { map: 'KAL', safe: 'P SEGURO', imageUrl: 'https://drive.google.com/uc?id=1tS9fdGb6n3s9_U2EOZXMiP85uV01cWX9' },
  { map: 'KAL', safe: 'REFINARIA', imageUrl: 'https://drive.google.com/uc?id=1NQgp7sjpChLexV4RsUKhRWcmGS07I8ZG' },
  { map: 'KAL', safe: 'PRISÃO', imageUrl: 'https://drive.google.com/uc?id=1OKdi5zQgucRyLBJnU7-C_UvKemeGUBhf' },
  { map: 'KAL', safe: 'RUÍNAS', imageUrl: 'https://drive.google.com/uc?id=1_C9YR-v_fZPtpYXn1hknnt2fjL13-IMP' },
  { map: 'KAL', safe: 'LABIRINTO', imageUrl: 'https://drive.google.com/uc?id=1CJHesd7fvqL_g7d_C3Vz2zsRiSkHVijc' },
  
  // Alpine - 12 unique safes
  { map: 'ALP', safe: 'FOZ', imageUrl: 'https://drive.google.com/uc?id=1-s2g85viL6Sa7LzhORoLnk1hJU8XK40K' },
  { map: 'ALP', safe: 'NEVADO', imageUrl: 'https://drive.google.com/uc?id=1UtZ6JHz8Pf-V1qJMp7aAhsk3RTLdqbjG' },
  { map: 'ALP', safe: 'CARROSSEL', imageUrl: 'https://drive.google.com/uc?id=1CCN1tNaF-TCLyeWYcDUcOJ1K_zruEZHw' },
  { map: 'ALP', safe: 'USINA', imageUrl: 'https://drive.google.com/uc?id=1XGErWSmgE7b87lWSV6hESl1za8IKVyOC' },
  { map: 'ALP', safe: 'QUARTEL', imageUrl: 'https://drive.google.com/uc?id=1WpI0GXs9gOa2IrF28AWlXuhKrlf1MG0m' },
  { map: 'ALP', safe: 'FERROVIÁRIA', imageUrl: 'https://drive.google.com/uc?id=1z6H2jnCrE4bzQZsxEL6JXxs46t0vgWNd' },
  { map: 'ALP', safe: '6 CASAS', imageUrl: 'https://drive.google.com/uc?id=1H9ytrRBDjylCfLUnb8BKnGlYrHyHUNzN' },
  { map: 'ALP', safe: 'F VERMELHA', imageUrl: 'https://drive.google.com/uc?id=1pTMUCy8o0Mj60-IMmtk2YaHXcGuN863d' },
  { map: 'ALP', safe: 'PLANTAÇÃO', imageUrl: 'https://drive.google.com/uc?id=1vu03wdNy90QQ0IORhG_VzBndEsvQT0CO' },
  { map: 'ALP', safe: 'LITORAL', imageUrl: 'https://drive.google.com/uc?id=1H3JSXMZaeZ8NQQaCgT-AHvHCw19eOLuT' },
  { map: 'ALP', safe: 'GUARNIÇÃO', imageUrl: 'https://drive.google.com/uc?id=1LltZhC35TwiQohzk900_bhLqb_eYjv7w' },
  { map: 'ALP', safe: 'COLONIA', imageUrl: 'https://drive.google.com/uc?id=1HgkNeRw8ouUxd6jSn3iH9h4RkPFsLogt' },
  
  // Nova Terra - 12 unique safes
  { map: 'NT', safe: 'FEIRA PLAZA', imageUrl: 'https://drive.google.com/uc?id=1inme428v46seOIou1GT-KeWd8EIYe3iv' },
  { map: 'NT', safe: 'VIADUTO', imageUrl: 'https://drive.google.com/uc?id=1Cxmb8PrJh0QjCmkj3r90sV9fC2WWGcW4' },
  { map: 'NT', safe: 'MANGUEZAL', imageUrl: 'https://drive.google.com/uc?id=1dA7_PsRyx1WE5FvIVRZjk6MZKOVD3JCx' },
  { map: 'NT', safe: 'MUSEU', imageUrl: 'https://drive.google.com/uc?id=1g4uF0Z6m8kjRMBy7NE2IdKhA8Av_RpDW' },
  { map: 'NT', safe: 'TIROLESA CIMA', imageUrl: 'https://drive.google.com/uc?id=1GnOgM_ykdpGQ9iBSWgU7LPM4_XxW5Nts' },
  { map: 'NT', safe: 'FAZENDINHA', imageUrl: 'https://drive.google.com/uc?id=1DYCtqZyA2WkjHm5F6vPVrN5jzJ00g6Qs' },
  { map: 'NT', safe: 'PLANETÁRIO', imageUrl: 'https://drive.google.com/uc?id=1yKBShDc3Hv0mZYmTvN29jzKZ1RIqoWID' },
  { map: 'NT', safe: 'CIDADE VELHA', imageUrl: 'https://drive.google.com/uc?id=1ZoUvvbTT6xuMgLd23XJSoZVk5Gk4eDmS' },
  { map: 'NT', safe: 'GALERIA DECA', imageUrl: 'https://drive.google.com/uc?id=1emJ13V9aIta01h3XgEnXGiM6Ai2alsXI' },
  { map: 'NT', safe: 'PONTES GÊMEAS', imageUrl: 'https://drive.google.com/uc?id=1t9sqzyxIOa7x6icqEzs36pOeqW4JpmNf' },
  { map: 'NT', safe: 'TIROLESA BAIXO', imageUrl: 'https://drive.google.com/uc?id=1QBrnxFmCfcnfCVsfMk60lsxJifYbNHmI' },
  { map: 'NT', safe: 'UNIVERSIDADE', imageUrl: 'https://drive.google.com/uc?id=1cN4oIJINClao1NDAgXm7mvHhHUfD2YEd' },
];

export const getUniqueMapNames = () => [...new Set(safes.map(s => s.map))];
export const getUniqueSafeNames = () => [...new Set(safes.map(s => s.safe))];
export const getSafesByMap = (map: string) => safes.filter(s => s.map === map);
export const getSafesBySafeName = (safeName: string) => safes.filter(s => s.safe === safeName);
