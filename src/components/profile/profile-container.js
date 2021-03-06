import axios from 'axios';
import { useState } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
// import ModalCrop from './components/modal';

let newInput;
let newChangedFields;

const UseProfileForm = (userData, token) => {
  const [profile, setProfile] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [changedFields, setChangedFields] = useState({});
  const [imageToSave, setImageToSave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);

  const fetchInterests = () =>
    axios
      .get(`${process.env.REACT_APP_PUBLIC_API_URL}/interests`, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token': token,
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        if (process.env.REACT_APP_VERBOSE === 'true') console.log(error);
      });

  if (_.isEmpty(profile)) {
    Promise.all([userData, fetchInterests()]).then(values => {
      const tempUserData = values[0].data;
      tempUserData.birthDate = new Date(tempUserData.birthDate)
        .toISOString()
        .split('T')[0];
      tempUserData.interestNames = values[1];
      setProfile(tempUserData);
      setLoaded(true);
    });
  }

  const handleTextParametersChange = event => {
    newInput = {
      ...profile,
      [event.target.name]: event.target.value,
    };
    newChangedFields = {
      ...changedFields,
      [event.target.name]: event.target.value,
    };
  };

  const isChecked = (fieldId, type) => {
    if (type === 'gender' && profile.gender) {
      const isCkecked = ('includes', profile.gender.includes(fieldId));
      return isCkecked;
    }
    if (type === 'sexualOrientation' && profile.sexualOrientation) {
      const isCkecked =
        ('includes', profile.sexualOrientation.includes(fieldId));
      return isCkecked;
    }
    return false;
  };

  const getAge = dateString => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ans `;
  };

  const handleNotifChange = event => {
    newInput = {
      ...profile,
      [event.target.name]: event.target.checked,
    };
    newChangedFields = {
      ...changedFields,
      [event.target.name]: event.target.checked,
    };
  };

  const handleChangeCity = cityToChange => {
    newInput = {
      ...profile,
      city: cityToChange,
    };
    setProfile(newInput);
  };

  const handleSexualOrientationChange = event => {
    const checkboxValue = parseInt(event.target.value, 10);
    if (event.target.checked === true) {
      profile.sexualOrientation.push(checkboxValue);
      profile.sexualOrientation.sort();
    } else {
      const index = profile.sexualOrientation.indexOf(checkboxValue);
      if (index > -1) {
        profile.sexualOrientation.splice(index, 1);
      }
    }
    newInput = {
      ...profile,
      [event.target.name]: profile.sexualOrientation,
    };
    newChangedFields = {
      ...changedFields,
      [event.target.name]: profile.sexualOrientation,
    };
  };

  const handleSummaryChange = event => {
    newInput = {
      ...profile,
      [event.target.name]: event.target.value,
    };
    newChangedFields = {
      ...changedFields,
      [event.target.name]: event.target.value,
    };
  };

  const handleInterestChange = event => {
    if (event.target.textContent === '') {
      const interestToDelete = event.currentTarget.closest('div').textContent;
      const newInterests = profile.interests;
      newInterests.splice(profile.interests.indexOf(interestToDelete), 1);
      newInput = {
        ...profile,
        interests: newInterests,
      };
      newChangedFields = {
        ...changedFields,
        interests: newInterests,
      };
    } else {
      newInput = {
        ...profile,
        interests: [...profile.interests, event.target.textContent],
      };
      newChangedFields = {
        ...changedFields,
        interests: [...profile.interests, event.target.textContent],
      };
    }
  };

  const handleGenderChange = event => {
    const checkboxValue = parseInt(event.target.value, 10);
    if (event.target.checked === true) {
      profile.gender.push(checkboxValue);
      profile.gender.sort();
    } else {
      const index = profile.gender.indexOf(checkboxValue);
      if (index > -1) {
        profile.gender.splice(index, 1);
      }
    }
    newInput = {
      ...profile,
      [event.target.name]: profile.gender,
    };
    newChangedFields = {
      ...changedFields,
      [event.target.name]: profile.gender,
    };
  };

  const handleProfileChange = event => {
    event.persist();

    if (event.target.type !== 'checkbox') {
      if (event.target.name === 'description') {
        handleSummaryChange(event);
      }
      if (event.type === 'click') {
        handleInterestChange(event);
      } else {
        handleTextParametersChange(event);
      }
    } else {
      if (event.target.name === 'gender') {
        handleGenderChange(event);
      }
      if (
        event.target.name === 'notificationMail' ||
        event.target.name === 'notificationPush'
      ) {
        handleNotifChange(event);
      }
      if (event.target.name === 'sexualOrientation') {
        handleSexualOrientationChange(event);
      }
    }

    setProfile(newInput);
    setChangedFields(newChangedFields);
  };

  const handleSubmitParameters = event => {
    event.persist();
    if (_.isEmpty(changedFields)) {
      toast.error("You didn't make any changes!");
    } else if (event) {
      event.preventDefault();
      axios
        .put(
          `${process.env.REACT_APP_PUBLIC_API_URL}/users`,
          changedFields,
          {
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'x-access-token': token,
            },
          },
        )
        .then(response => {
          if (response.data.success === true) {
            toast.success(response.data.message);
            setChangedFields({});
          } else {
            response.data.errors.forEach(error => {
              toast.error(error);
            });
          }
        });
    }
  };

  const readFile = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  };

  const sendCroppedImageServer = formData => {
    axios
      .post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/images/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token,
          },
        },
      )
      .then(response => {
        if (profile.profilePicture === null) {
          const newInput = {
            ...profile,
            images: [...profile.images, response.data.Location],
            profilePicture: response.data.Location,
          };
          setProfile(newInput);
        } else {
          const newInput = {
            ...profile,
            images: [...profile.images, response.data.Location],
          };
          setProfile(newInput);
        }
      })
      .catch(error => {
        if (process.env.REACT_APP_VERBOSE === 'true') console.log(error);
      });
    setShowModal(false);
  };

  const upload = imageBlob => {
    const image = blobToFile(imageBlob, 'coucou.png');
    const formData = new FormData();
    formData.append('file', image);
    setFinalImage(formData);
  };

  const handleFileUpload = async event => {
    if (event.target.files[0]) {
      const imageDataUrl = await readFile(event.target.files[0]);
      setShowModal(true);
      setImageToSave(imageDataUrl);
    }
  };

  const handleDeleteImage = url => {
    axios
      .post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/images/delete`,
        { url },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'x-access-token': token,
          },
        },
      )
      .then(response => {
        if (response.data.success === true) {
          if (url === profile.profilePicture) {
            const newInput = {
              ...profile,
              images: _.without(profile.images, url),
              profilePicture:
                _.without(profile.images, url)[0] ||
                'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
            };
            setProfile(newInput);
          } else {
            const newInput = {
              ...profile,
              images: _.without(profile.images, url),
            };
            setProfile(newInput);
          }
        }
      })
      .catch(error => {
        if (process.env.REACT_APP_VERBOSE === 'true') console.log(error);
      });
  };

  const handleChangeProfileImage = pictureUrl => {
    const newInput = {
      ...profile,
      profilePicture: pictureUrl,
    };
    const newChangedFields = {
      ...changedFields,
      profilePicture: pictureUrl,
    };
    setProfile(newInput);
    setChangedFields(newChangedFields);
  };

  const handleChangeLocation = newLocation => {
    const newInput = {
      ...profile,
      location: newLocation,
    };
    const newChangedFields = {
      ...changedFields,
      location: newLocation,
    };
    setProfile(newInput);
    setChangedFields(newChangedFields);
  };

  const deleteUser = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account ?',
    );
    if (confirmation) {
      axios
        .delete(`${process.env.REACT_APP_PUBLIC_API_URL}/users/`, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'x-access-token': token,
          },
        })
        .then(response => {
          if (response.data.deleted === true) {
            localStorage.removeItem('token');
            window.location = '/?message=delete_success';
          } else {
            if (process.env.REACT_APP_VERBOSE === 'true')
              console.log(response.data);
          }
        });
    }
  };

  return {
    handleFileUpload,
    handleDeleteImage,
    handleProfileChange,
    handleChangeCity,
    handleSexualOrientationChange,
    handleSummaryChange,
    profile,
    loaded,
    handleChangeProfileImage,
    handleInterestChange,
    handleChangeLocation,
    handleSubmitParameters,
    isChecked,
    getAge,
    fetchInterests,
    deleteUser,
    showModal,
    setShowModal,
    imageToSave,
    setImageToSave,
    croppedImage,
    setCroppedImage,
    upload,
    finalImage,
    sendCroppedImageServer,
  };
};

export default UseProfileForm;
