import React, { useState, useEffect } from 'react';
import Sidebar from '../../website/src/components/layout/Sidebar';
import backgroundImage from '../../website/src/assets/Background-Para.jpg';
import axiosClient from '../utils/axiosClient';
import { useAuth } from '../../website/src/hooks/useAuth';

const AccountGestion: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isEmail2FA, setIsEmail2FA] = useState<boolean>(false);
  const [otpAuthUrl, setOtpAuthUrl] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');

  const { fetchUser, user, logout } = useAuth(); //recupere les fonction/states de useAuth
  
  const is2FAEnabled = user?.is2fa ?? false;

  const sendMessage = (msg: string): void => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 5000); // Le message disparaît après 5 secondes
  };
  
  const Avatar: React.FC = () => {
    let resolvedSrc: string = '/avatar.png';

    if (user?.avatar)
      resolvedSrc = user.avatar;
    else if (user?.avatarDefault) {
      if (typeof user.avatarDefault === 'string' && user.avatarDefault.trim().length > 0) {
        resolvedSrc = `data:image/png;base64,${user.avatarDefault}`;
      }
    }

    return (
      <div className="flex items-center justify-center relative group">
        <img
          src={resolvedSrc}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:animate-spin"
          onError={(e) => { (e.target as HTMLImageElement).src = '/avatar.png'; }}
        />
        <div className='absolute rounded-full bg-black w-3 h-3 outline outline-5 outline-white/70'></div>
      </div>
    );
  };

  //////////////////////////  Handlers //////////////////////////

  ////////////////// YUSERNAM //////////////
  const handleUsernameSubmit = async (): Promise<void> => {
    if (!newUsername || newUsername === user?.username)
      return sendMessage('❌ Please put a Valid Username');

    try {
      await axiosClient.post(`/change-username`, { newUsername });
      setNewUsername('');
      await fetchUser();
      sendMessage('✅ Username Updated !');
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || 'Unknown error handler username');
      }
    }
  };
      
  //////////////////E MAIL ////////////////////////////////
  const handleEmailSubmit = async (): Promise<void> => {
    if (!newEmail || newEmail === user?.email)
      return sendMessage('❌ Please put a Valid Email.');

    try {
      await axiosClient.post('/change-email', { newEmail });

      setNewEmail('');
      sendMessage('✅ Email Updated with success !');
      await fetchUser();
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || 'Error inconnueo handler email');
      }
    }
  };
    ///////////////////////////// PASSWORD /////////////////////
  const handlePasswordSubmit = async (): Promise<void> => {
    if (!oldPassword || !newPassword)
      return sendMessage('❌ Please complete all password.');

    try {
      await axiosClient.post('/change-password', { oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      sendMessage('✅ Password changed with success !');
      await fetchUser();
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || 'Unknown error handler pass');
      }
    }
  };
  //////////////////// ACANAVATAR ///////////////////////
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
    const isValidType = ALLOWED_TYPES.includes(file.type);
    if (!isValidType) {
      sendMessage("❌ Only PNG and JPEG accepted,stupedasso !");
      e.target.value = ''; // Reinit l'input de fichier
      return;
    }

    // verif de la taille du fichier (maximum 300 KB)
    const MAX_FILE_SIZE = 300 * 1024; // 300 KB
    if (file.size > MAX_FILE_SIZE) {
      sendMessage("❌ File Tooooo Big max size : 300KB.");
      e.target.value = ''; // reinit l'input de fichier
      return;
    }

    // Si le fichier est valide, le lire avec FileReader
    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatarData = reader.result as string;
      setAvatar(avatarData);
      
      // Envoi automatique de l'avatar
      try {
        await axiosClient.post('/change-avatar', { avatar: avatarData });
        sendMessage('✅ Avatar Updated with success !');
        await fetchUser();
      } catch (err: any) {
        if (err.response?.status === 403) {
          logout();
        } else
          sendMessage(err.response?.data?.error || 'Unknown error handler avatar');
      }
    };
    reader.readAsDataURL(file);
  };

  /////////////////////////// 2 FACTOR ////////////////////////
  const handleEnable2FA = async (): Promise<void> => {
    try {
      const res = await axiosClient.post('/enable2fa', {});

      if (res.data.success) {
        setOtpAuthUrl(res.data.otpauth_url);
      } else {
        sendMessage(res.data.error || 'Error with 2FA activation');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || '❌ Error with 2FA activation');
      }
    }
  };
  
  const handleDisable2FA = async (): Promise<void> => {
    try {
      const res = await axiosClient.post('/disable2fa', {});

      if (res.data.success) {
        setOtpAuthUrl(null);
        sendMessage('✅ 2FA disabled');
        await fetchUser();
      } else {
        sendMessage(res.data.error || 'Error with 2FA deactivation');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || 'Error with 2FA deactivation');
      }
    }
  };

  const handleSend2FAEmail = async (): Promise<void> => {
    try {
      const res = await axiosClient.post('/send2faEmail', {email: user?.email});

      if (res.data.success) {
        setIsEmail2FA(true);
        sendMessage('📧 Code send by email');
      } else {
        sendMessage(res.data.error || 'Error while sending mail');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || 'Error while sending mail');
      }
    }
  };

  const handleVerify2FA = async (): Promise<void> => {
    if (!twoFactorCode) return sendMessage("⛔ Need 2FA Code");

    try {
      const res = await axiosClient.post('/verify2fa', { token: twoFactorCode });

      if (res.data.success) {
        sendMessage('✅ 2FA activated with success !');
        await fetchUser();
        setOtpAuthUrl(null);
        setTwoFactorCode('');
      } else {
        sendMessage(res.data.error || 'Error while verification');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        logout();
      } else {
        sendMessage(err.response?.data?.error || "Error serv verifecation 2FA");
      }
    }
  };

  ////////////////////////// 🎯 UseEffects //////////////////////////
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');
    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      window.history.replaceState({}, document.title, window.location.pathname); //clean the URL
    fetchUser();
    }
  }, [fetchUser]); //FOR GOOGLE TOKEN

  const isGoogle = user?.genre === 'Google';

  ////////////////////////// 🧼 UI //////////////////////////
  return (
    <div className="min-h-screen overflow-hidden">
      <Sidebar />
      <div 
        className="min-h-screen w-full bg-center bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Titre */}
        <div className="absolute top-5 left-20 z-10 hidden sm:block">
          <h1 className="text-4xl mobile:text-3xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
            Account_Gestion
          </h1>
        </div>
        {/* Contenu principal */}
        <div className="flex justify-center items-center min-h-screen relative z-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 w-[800px] h-[650px] border border-white/10 space-y-6 overflow-y-auto max-h-[90vh]">
            {/* Section Avatar */}
            <section className="space-y-4">
              {/* <h2 className="text-2xl font-bold text-white hidden sm:block">Avatar</h2> */}
              <div className="flex flex-col items-center">
                <Avatar />
                <label className="flex custom-file-input cursor-pointer">
                  Choose an image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            {/* Informations du compte */}
            <section className="space-y-4">
              {/* <h3 className="text-2xl font-bold text-white">Informations du compte</h3> */}
              <div>
                <p className="text-white font-bold">Username :</p>
                <input type="text" placeholder={newUsername || user?.username || ''} onChange={(e) => setNewUsername(e.target.value)} className="bg-white/40 rounded-lg py-2" />
                <button onClick={handleUsernameSubmit} className="sm:ml-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                  Change Username
                </button>
              </div>
              <div>
                <p className="text-white font-bold">Email :</p>
                <input type="text" placeholder={newEmail || user?.email || ''} onChange={(e) => setNewEmail(e.target.value)} disabled={isGoogle} className="bg-white/40 rounded-lg py-2" />
                <button onClick={handleEmailSubmit} disabled={isGoogle} className="sm:ml-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                  Change Email
                </button>
              </div>
              <div>
                <p className="text-white font-bold">Old Password :</p>
                <input className="mt-2 bg-white/40 rounded-lg py-2" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={isGoogle} />
              </div>
              <div>
                <p className="text-white font-bold">New Password :</p>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isGoogle} className="bg-white/40 rounded-lg py-2"/>
                <button onClick={handlePasswordSubmit} className="sm:ml-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                  Change Password
                </button>
              </div>
        {/* ENABLE 2FA BUTTON */}
        <div className="mt-6 group w-fit">
        <h3 className="text-2xl font-bold text-white">Security</h3>
        <button
        onClick={logout}
        className="mt-2 mr-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-[500ms] group-hover:translate-x-[200%] group-hover:rotate-[360deg]"
        >
        Loooog-Oooout
        </button>
        {is2FAEnabled ? (  //check if 2fa active
          <>
          <p className="text-white-400">✅ 2FA Activated</p>
          <button
            onClick={handleDisable2FA}
            className="mt-2 px-4 py-2 hover:bg-white-700 text-white rounded-lg"
          >
            Desactivate 2FA
          </button>
          </>
        ) : ( //if 2FA not active show button
          <>
          <button
            onClick={handleEnable2FA}
            className="mt-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
          >
            Activate 2FA
          </button>
          {otpAuthUrl && ( //POUR AFFICHER QR CODE
            <div className="mt-4">
            {!isEmail2FA ? (
              <>
              <p className="text-white">Scan this QR code with authenticator APP :</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(otpAuthUrl)}&size=200x200`}
                alt="QR Code 2FA"
                className="mt-2 w-30"
              />
              <button
                onClick={handleSend2FAEmail}
                className="bg-white px-4 py-2 text-black rounded-lg mt-4"
              >
                Send 2FA by email
              </button>
              </>
            ) : (
              <>
              <p className="text-white">📧 Code send to your Mail !</p>
              <button
                onClick={() => setIsEmail2FA(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                USE QR code
              </button>
              </>
            )}

            <input
              type="text"
              placeholder="Code 2FA"
              className="w-full px-4 py-2 rounded bg-white/10 text-white mt-4"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />
            <button
              onClick={handleVerify2FA}
              className="bg-white px-4 py-2 hover:bg-white-700 text-black rounded-lg mt-4"
            >
              Verify Code
            </button>
            </div>
          )}
          </>
        )}
        </div>
            </section>

            {/* Messages du serveur */}
            {message && (
              <div className="mx-auto bg-black/30 font-bold backdrop-blur-md px-6 py-4 rounded-lg text-white z-50 max-w-md w-full text-center">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountGestion;
