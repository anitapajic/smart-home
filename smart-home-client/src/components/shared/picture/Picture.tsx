import { Device } from "../../../models/Device";
import { RealEstate } from "../../../models/RealEstate";
import { User } from "../../../models/User";
import { Input } from "../../../pages/LoginPage/LoginPage.styled";
import { ImagePreview, Image } from "./Picture.styled";

export type PictureProps = {
  src: string;
};

interface FileInputProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileSource: string | null;
  altText: string;
  isValid: boolean;
}
export const renderFileInputSection = ({ handleChange, fileSource, altText, isValid }: FileInputProps) => (
  <>
    <Input
      type="file"
      accept="image/*"
      onChange={handleChange}
      className={isValid ? '' : 'invalidInput'}
    />
    {fileSource && typeof fileSource === 'string' && (
      <ImagePreview src={fileSource} alt={altText} />
    )}
  </>
);



export default function Picture({ src }: PictureProps) {

  return <Image src={src} />;
}

