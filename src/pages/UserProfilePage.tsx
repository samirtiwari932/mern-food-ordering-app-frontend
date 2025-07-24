import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading } = useGetMyUser();
  const { updateUser, isPending } = useUpdateMyUser();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) { 
    return <span>
      Unable to load user profile 
    </span>
  }
  return <UserProfileForm currentUser={currentUser} onSave={updateUser} isLoaading={isPending} />;
};

export default UserProfilePage;
