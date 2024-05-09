import { envUtil } from '@pulsifi/fn';

export const PulsifiConfig = {
    pulsifi_assets_domain: envUtil.get('PULSIFI_ASSETS_DOMAIN'),
    pulsifi_assets_pdf_custom_fonts: envUtil.get(
        'PULSIFI_ASSETS_PDF_CUSTOM_FONTS',
    ),
};
