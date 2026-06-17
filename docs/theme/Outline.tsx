import { useI18n } from '@rspress/core/runtime';
import {
  EditLink,
  ReadPercent,
  Toc,
  useDynamicToc,
  useEditLink,
} from '@rspress/core/theme-original';

export default function Outline() {
  const t = useI18n();
  const headers = useDynamicToc();
  const editLink = useEditLink();

  if (headers.length === 0) {
    return null;
  }

  return (
    <div className="rp-outline">
      <div className="rp-outline__title">
        {t('outlineTitle')}
        <ReadPercent size={14} strokeWidth={2} />
      </div>
      <nav className="rp-outline__toc rp-scrollbar">
        <Toc />
      </nav>
      {editLink ? (
        <>
          <div className="rp-outline__divider" />
          <div className="rp-outline__bottom">
            <EditLink isOutline />
          </div>
        </>
      ) : null}
    </div>
  );
}
