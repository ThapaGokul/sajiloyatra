import BookingWidget from '../BookingWidget';
import styles from './PaymentPopup.module.css';

export default function PaymentPopup({ room, lodgingName, lodgingId, onClose }) {
  if (!room) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Confirm Reservation</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          <div style={{marginBottom: '20px'}}>
            <h4 style={{margin: '0 0 5px 0'}}>{room.name}</h4>
            <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>at {lodgingName}</p>
          </div>
          
          <BookingWidget 
            lodgingId={lodgingId}
            roomTypeId={room.id}
            lodgingName={`${lodgingName} - ${room.name}`}
            lodgingPrice={room.pricePerNight}
          />
        </div>
      </div>
    </div>
  );
}