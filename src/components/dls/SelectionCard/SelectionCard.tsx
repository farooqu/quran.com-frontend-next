/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ChevronRightIcon from '../../../../public/icons/chevron-right.svg';

import styles from './SelectionCard.module.scss';

type SelectionCard = {
  label: string;
  value: string;
  onClick?: () => void;
};

const SelectionCard = ({ label, value, onClick }: SelectionCard) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.labelContainer}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <div className={styles.iconContainer}>
        <ChevronRightIcon />
      </div>
    </div>
  );
};

export default SelectionCard;
