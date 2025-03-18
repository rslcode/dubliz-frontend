import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { AccountController } from '@/core/controllers/account'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { UploadProfileImageButton } from './upload-image-button'
import { useRouter } from 'next/navigation'
import { LocationsSearchInput } from '@/components/auction-form/location/search-input'
import { GooglePlaceDetails, GooglePlacesPrediction } from '@/core/domain/location'
import { LocationsController } from '@/core/controllers/locations'
import { VerifiedBadge } from '@/components/common/verified-badge'

export const ProfileSettingsProfile = observer(() => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const router = useRouter()
  const [name, setName] = useState(AppStore.accountData?.name ?? '')
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null)
  const [changeMade, setChangeMade] = useState(false)
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const [settingLocation, setSettingLocation] = useState(false)
  const [initialLocation, setInitialLocation] = useState<GooglePlaceDetails | null>(null)

  useEffect(() => {
    if (initialLocation) {
      return
    }

    const location = AppStore.accountData?.locationLatLng
    if (!location) {
      return
    }

    const computeLocation = async () => {
      const placeDetails = await LocationsController.getPlaceDetailsFromLatLng(
        location.lat,
        location.lng
      )
      setInitialLocation(placeDetails)
    }
    computeLocation()

  }, [AppStore.accountData, initialLocation])

  useEffect(() => {
    if (newProfilePicture) {
      setChangeMade(true)
      return
    }

    if (name !== AppStore.accountData?.name) {
      setChangeMade(true)
      return
    }

    setChangeMade(false)
  }, [name, newProfilePicture])

  const handleSubmit = async () => {
    if (!changeMade || submitInProgress) {
      return
    }

    setSubmitInProgress(true)
    try {
      const updated = await AccountController.updateNameAndProfilePicture(
        name,
        newProfilePicture ?? undefined
      )
      if (!updated) {
        toast.error(t('generic.something_went_wrong'))
      } else {
        toast.success(t('profile.update.update_success'))
      }
      setChangeMade(false)
      router.refresh()
    } catch (error) {
      console.error(`Failed to update account name: ${error}`)
    } finally {
      setSubmitInProgress(false)
    }
  }

  const handleLocationPick = async (location: GooglePlacesPrediction | null) => {
    if (settingLocation) {
      return
    }

    if (!location) {
      setSettingLocation(true)
      try {
        const saved = await AccountController.saveLocationToAccount()
        if (saved) {
          toast.success(t('profile.update.update_success'))
        }
      } catch (error) {
        console.error(`Failed to get device location: ${error}`)
      } finally {
        setSettingLocation(false)
      }
      return
    }

    const locationDetails = await LocationsController.getGooglePlaceDetails(location.reference)
    if (!locationDetails) {
      return
    }

    setSettingLocation(true)
    try {
      const { lat, lng } = locationDetails.geometry.location
      const saved = await AccountController.saveLocationToAccount(lat, lng, locationDetails.name)
      if (saved) {
        toast.success(t('profile.update.update_success'))
      }
    } catch (error) {
      console.error(`Could not save location to account: ${error}`)
    } finally {
      setSettingLocation(false)
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center flex-column">
        <div className='position-relative'>
          <Image
            src={
              newProfilePicture
                ? URL.createObjectURL(newProfilePicture)
                : AppStore.accountData!.picture
            }
            alt="profile-picture"
            className="profile-picture"
            width={100}
            height={100}
            style={{ borderRadius: '50%' }}
          />
          <div className='verified-badge-container'><VerifiedBadge verified={AppStore.accountData!.verified} size={32} /></div>
        </div>
        <div className="mt-20">
          <UploadProfileImageButton onFilesPick={setNewProfilePicture} />
        </div>
      </div>
      <div className="mt-40">
        <label htmlFor="profile-name" className="mb-10">
          {t('profile.update.application_name')}
        </label>
        <input
          name="profile-name"
          className="create-auction-input create-auction-no-icon-input"
          id="profile-name"
          value={name}
          maxLength={100}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('create_auction.enter_description')}
        />
        <div className="d-flex justify-content-end mt-1">
          <span className="fw-light">{name.length}/50</span>
        </div>
      </div>

      <div className="mt-10">
        <label className="mb-10">{t('location.location')}</label>
        <LocationsSearchInput
          selectedLocation={initialLocation}
          searchInProgress={settingLocation}
          onLocationPicked={handleLocationPick}
        />
        <div className="mt-10">
          <span>{t('profile.update.save_location_to')}</span>
        </div>
      </div>

      <div className="mt-40">
        <label htmlFor="profile-email" className=" mb-10">
          {t('profile.update.email')}
        </label>
        <input
          name="profile-email"
          className="create-auction-input create-auction-no-icon-input"
          id="profile-email"
          value={AppStore.accountData?.email}
          disabled
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('create_auction.enter_description')}
        />
        <div className="mt-10">
          <span>{t('profile.update.cannot_update_email')}</span>
        </div>
      </div>

      <div className="mt-40 mb-30">
        <label htmlFor="profile-phone" className=" mb-10">
          {t('phone_sign_in.phone_number')}
        </label>
        <input
          name="profile-phone"
          className="create-auction-input create-auction-no-icon-input"
          id="profile-phone"
          value={AppStore.accountData?.phone}
          disabled
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('profile.update.cannot_update_phone_number')}
        />
        <div className="mt-10">
          <span>{t('profile.update.cannot_update_phone_number')}</span>
        </div>
      </div>

      <button
        className={`${changeMade ? 'fill-btn' : 'disabled-btn'} mt-20`}
        disabled={submitInProgress || !changeMade}
        onClick={handleSubmit}
      >
        {submitInProgress ? (
          <div className="loader-wrapper">
            <Icon type="loading" size={40} />
          </div>
        ) : (
          t('profile.update.update_account')
        )}
      </button>
    </div>
  )
})
