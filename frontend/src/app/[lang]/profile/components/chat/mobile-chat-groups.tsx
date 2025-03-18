import CustomSelect, { CustomSelectOption } from '@/components/common/custom-select'
import { ChatGroup } from '@/core/domain/chat-group'
import { AppStore } from '@/core/store'
import { generateNameForAccount } from '@/utils'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'

export const ProfileMobileChatGroups = observer(
  (props: { chatGroups: ChatGroup[]; onSelect: (chatGroup: ChatGroup) => void }) => {
    const { chatGroups, onSelect } = props

    const options: CustomSelectOption[] = chatGroups.map((chatGroup) => {
      const accountToDisplay =
        AppStore.accountData?.id === chatGroup.firstAccountId
          ? chatGroup.secondAccount
          : chatGroup.firstAccount

      return {
        id: chatGroup.id,
        option: generateNameForAccount(accountToDisplay!),
        icon: (
          <Image
            width={40}
            height={40}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            src={accountToDisplay!.picture}
            alt="account"
          />
        ),
      }
    })

    const handleSelect = (options: CustomSelectOption) => {
      const chatGroup = chatGroups.find((chatGroup) => chatGroup.id === options.id)
      if (chatGroup) {
        onSelect(chatGroup)
      }
    }

    return (
      <CustomSelect
        withSearch
        options={options}
        defaultCurrent={0}
        onChange={handleSelect}
        name="chat-groups-filter"
        className="w-100 mt-1 mobile-chat-groups-select"
        itemClassName="mobile-chat-groups-select-item"
      />
    )
  }
)
