import Sidebar from '../components/layout/Sidebar';
import backgroundImage from '../assets/Background-Profil.jpg';
import YeQuoteGenerator from '../components/layout/YeQuoteGenerator';
import Page_name from '../components/layout/Page_name';
import axiosClient from '../../../account/utils/axiosClient';
import { useAuth } from '../hooks/useAuth';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface User{
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatar?: string;
  avatarDefault?: string;
  numOfGames: number;
  wins: number;
  losses: number;
}

const Profile: React.FC = (): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const { username } = useParams();
  
  useEffect(() => {
    const fetchProfile = async () => {
    if (!isAuthenticated && !username) {
      setError("You need to be connected to see your profil (bogoss)");
      return;
    }
      try {
        const endpoint = username 
          ? `/you/${username.toLowerCase()}`
          : `/me`;

        const res = await axiosClient.get(endpoint);

        if (res.data.success) {
          setProfileUser(res.data.user);
          setError(null);
        } else {
          setError(res.data.error || "Error while profil recuperation");
        }
      } catch (err: any) {
        console.log("Error while profil recuperation:", err);
    if (err.response) {
      if (err.response.status === 404)
        setError("Profil not found");
      else if (err.response.status === 401 || err.response.data === 403)
        setError("Access non-authorized need to connect bg a la creme patissiere");
      else
        setError(err.response.data.error || "Error server connexion");
    }
    else if (err.request)
      setError("Impossible to connect to server");
    else
      setError("faut arreter de deconner ya quoi comme erreur la encore, jamais tranquille et puis quoi encore Macron 3eme mandat ?? MDRRRRRRRRRRRRRRRRRRR(ouais je parle francais aussi et alors)");
      }
    };
    fetchProfile();
  }, [username, isAuthenticated]);

  if (error) return <div className="text-white text-center mt-8">{error}</div>;
  if (!profileUser) return <div className="text-white text-center mt-8">Loading Profil...</div>;

  return (
    <div className="relative overflow-x-hidden bg-black">
      <Sidebar />
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <Page_name />

        {/* Container principal avec flex */}
        <div className="w-full px-4 pt-24 flex flex-col">
          {/* Container pour les cartes */}
          <div className="w-full flex mobile:flex-col gap-8 ml-[320px] mobile:ml-0 mobile:items-center">
            {/* Carte Profil */}
            <div className="w-[360px] mobile:w-full mobile:max-w-[360px] h-[510px] mobile:h-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 mobile:p-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-20 h-20 max-[1070px]:w-16 max-[1070px]:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-6 overflow-hidden">
                  <img
                    src={profileUser.avatar || `data:image/png;base64,${profileUser.avatarDefault}`}
                    alt="Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/avatar.png';
                    }}
                  />
                </div>

                {/* Informations */}
                <div className="w-full space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{profileUser.username}</h2>
                  </div>

                  <div className="space-y-3 text-white/80">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Username</span>
                      <span className="text-white">{profileUser.username}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Email</span>
                      <span className="text-white">{profileUser.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>Member since</span>
                      <span className="text-white">{profileUser.created_at}</span>
                    </div>
                  </div>
                  <div className="pt-4">
                  <Link to="/account/gestion" className="block">
                  <button className="w-full py-2 rounded-full bg-white/10 text-white hover:bg-white/30 transition duration-300">
                    Edit Profil
                  </button>
                </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stsastsistsisques */}
            <div className="w-[360px] mobile:w-full mobile:max-w-[360px] h-[510px] mobile:h-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 mobile:p-6">
              <div className="h-full">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Statistics</h2>
                <div className="space-y-4 text-white/80">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Games Played</span>
                    <span className="text-white">{profileUser.numOfGames}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Victories</span>
                    <span className="text-white">{profileUser.wins}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Defeats</span>
                    <span className="text-white">{profileUser.losses}</span>
                  </div >
                  {/* boutton historique */}
                  <div className="pt-4">
                    <Link to={username ? `/account/historique/${username}` : "/account/historique"} className="block">
                    <button className="w-full py-2 rounded-full bg-white/10 text-white hover:bg-white/30 transition duration-300">
                      History
                    </button>
                    </Link>
                  </div>

                    <div/>
                  {/* <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Win Rate</span>
                    <span className="text-white">90%</span>
                  </div> */}

                  {/* Dernière Faaaaake partie */}
                  <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10" title="FAAAAAKE COMPONENT">
                    <h3 className="text-white text-lg font-semibold mb-3 text-center">Last Game</h3>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-3xl font-bold text-white">10 - 8</span>
                      <span className="px-3 py-1 rounded bg-green-500/20 text-green-400 font-semibold">
                        WIN
                      </span>
                      <div className="text-white/70 text-sm">
                        vs <span className="text-white">Drake</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Citation */}
          <div className="flex justify-center mt-8 mb-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mobile:p-4 w-[600px] mobile:w-full mobile:max-w-[360px] min-h-[180px] flex items-center justify-center">
              <blockquote className="flex flex-col items-center justify-center text-center">
                <span className="text-white/50 text-6xl mobile:text-4xl mb-4">"</span>
                <p className="text-white text-2xl mobile:text-xl font-light italic mb-4 px-4 mobile:px-6 leading-relaxed">
                  I feel like me and Taylor might still have sex, why?<br />
                  I made that bitch famous.
                </p>
                <cite className="text-white/80 text-xl mobile:text-lg">- Ye</cite>
              </blockquote>
            </div>
          </div>

          {/* YeQuoteGenerator */}
          <div className="hidden fullscreen:block fixed top-24 right-20">
            <YeQuoteGenerator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
