import { useState } from 'react'

interface ProfileSettingsNotificationItemProps {
  title: string
  description: string
  isSelected: boolean
  onSelect: (value: boolean) => void
}

export const ProfileSettingsNotificationItem = (props: ProfileSettingsNotificationItemProps) => {
  const { title, description, onSelect } = props
  const [isSelected, setIsSelected] = useState(props.isSelected)

  const handleSelect = () => {
    setIsSelected(!isSelected)
    onSelect(!isSelected)
  }

  return (
    <div
      className="mt-10 p-16 d-flex align-items-center justify-content-between gap-2 profile-notification-item"
      onClick={handleSelect}
    >
      <div className="d-flex flex-column">
        <span className="fw-bold">{title}</span>
        <span className="secondary-color">{description}</span>
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          onChange={handleSelect}
          checked={isSelected}
        />
      </div>
      <style jsx>{`
        .profile-notification-item {
          border-radius: 6px;
          cursor: pointer;
        }
        .profile-notification-item:hover {
          background: var(--background_2);
        }
      `}</style>
    </div>
  )
}
