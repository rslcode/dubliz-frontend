import { useTranslation } from '@/app/i18n/client'
import { CustomInput } from '@/components/common/custom-input'
import { NoDataCard } from '@/components/common/no-data-card'
import { NoResultsAvailable } from '@/components/common/no-results'
import { ChatGroupCard } from '@/components/header/chat/group-card'
import { ChatGroup } from '@/core/domain/chat-group'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { ProfileMobileChatGroups } from './mobile-chat-groups'
import { ChatController } from '@/core/controllers/chat'
import dynamic from 'next/dynamic'

const ChatWindow = dynamic(() => import('@/components/chat/window'), { ssr: false })

export const ProfileChat = observer((props: { isMobile: boolean }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const sortChatGroups = (chats: ChatGroup[]) => {
    return chats.slice().sort((a, b) => {
      return (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0)
    })
  }

  const [searchKeyword, setSearchKeyword] = useState('')
  const initialChatGroups = AppStore.chatGroups
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(sortChatGroups(initialChatGroups))
  const [selectedChatGroup, setSelectedChatGroup] = useState<ChatGroup | null>(null)

  const screenIsBig = useScreenIsBig(!props.isMobile)

  useEffect(() => {
    if (initialChatGroups.length) {
      setChatGroups(sortChatGroups(initialChatGroups))
    }
  }, [initialChatGroups])

  useEffect(() => {
    if (chatGroups && !selectedChatGroup) {
      setSelectedChatGroup(chatGroups[0])
    }
  }, [chatGroups, selectedChatGroup])

  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    const lowercaseKeyword = value.toLowerCase()
    const filteredGroups = AppStore.chatGroups.filter((group) => {
      const accountToSearch =
        group.firstAccount?.id === AppStore.accountData?.id
          ? group.secondAccount
          : group.firstAccount
      return accountToSearch?.name.toLowerCase().includes(lowercaseKeyword)
    })
    setChatGroups(sortChatGroups(filteredGroups))
  }

  const openChatGroup = (chatGroup: ChatGroup) => {
    setSelectedChatGroup(chatGroup)
    ChatController.markMessagesAsSeen(chatGroup.id)
  }

  if (!initialChatGroups.length) {
    return <NoResultsAvailable title={t('chat.no_conversations_available')} />
  }

  return (
    <div className="gap-4 profile-chats-root">
      {screenIsBig ? (
        <div className="profile-chat-groups p-16">
          <CustomInput
            secondary
            placeholder={t('home.search.search')}
            style={{ width: '100%' }}
            value={searchKeyword}
            onChange={handleSearch}
          />
          <div className="mt-20 profile-chat-groups-list">
            {!chatGroups.length && searchKeyword.length && (
              <NoDataCard title={t('info.no_chat_to_match')} />
            )}
            {chatGroups.map((group, i) => {
              return (
                <ChatGroupCard
                  key={i}
                  chatGroup={group}
                  openChatGroup={() => openChatGroup(group)}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <ProfileMobileChatGroups chatGroups={chatGroups} onSelect={openChatGroup} />
      )}

      <div className="profile-chat-messages pos-rel">
        {selectedChatGroup ? (
          <ChatWindow containedWindow chatGroup={selectedChatGroup} />
        ) : (
          <div>No data yet</div>
        )}
      </div>
    </div>
  )
})
