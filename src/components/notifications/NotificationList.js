import NotificationItem from "./NotificationItem";

export default function NotificationList({ items, onMarkRead, onDelete, loading = false }) {
  if (loading) return <div className="alert alert-info">Loading notifications...</div>;
  if (!items.length) return <div className="alert alert-secondary">No notifications found.</div>;

  return (
    <div>
      {items.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
