export default function NotificationItem({ item, onMarkRead, onDelete }) {
  return (
    <div className={`card shadow-sm border-0 mb-2 ${item.is_read ? "opacity-75" : ""}`}>
      <div className="card-body d-flex justify-content-between align-items-start gap-3">
        <div>
          <p className="mb-1">{item.message}</p>
          <small className="text-muted">
            {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
          </small>
        </div>

        <div className="d-flex gap-2">
          {!item.is_read && (
            <button className="btn btn-outline-primary btn-sm" onClick={() => onMarkRead(item.id)}>
              Mark read
            </button>
          )}
          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
