import { useEffect, useRef, useState } from "react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { Button, Group, Text, useMantineTheme, Image } from "@mantine/core";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import classes from "./ImageDropzoneButton.module.css";
import { uploadProfileImage } from "../api/JobSeeker";

type UUID = string; // Define UUID as a string or use a library

type ImageDropzoneButtonType = {
  userId: UUID;
  bucketName: string;
  prefixPath: string;
};

export function ImageDropzoneButton({
  userId,
  bucketName,
  prefixPath,
}: ImageDropzoneButtonType) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [currentfile, setCurrentFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = async () => {
    if (currentfile) {
      try {
        const formData = new FormData();
        formData.append("image", currentfile);

        console.log("Uploading file:", currentfile);
        await uploadProfileImage(formData);

        console.log("File uploaded successfully");
        console.log("userId: ", userId);
        console.log("bucketName: ", bucketName);
        console.log("prefixPath: ", prefixPath);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  // Generate image preview when currentfile changes
  useEffect(() => {
    if (currentfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(currentfile);
    } else {
      setImagePreview(null);
    }
  }, [currentfile]);

  return (
    <div className={classes.wrapper}>
      {/* Dropzone for file upload */}
      <Dropzone
        openRef={openRef}
        onDrop={(files) => {
          setCurrentFile(files[0]);
        }}
        className={classes.dropzone}
        radius="md"
        accept={[
          MIME_TYPES.jpeg,
          MIME_TYPES.png,
          "image/svg+xml", // Correct MIME type for SVG
          MIME_TYPES.gif,
        ]}
        maxSize={1.5 * 1024 ** 2} // 1.5MB
        maxFiles={1}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload
                size={50}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop image files here</Dropzone.Accept>
            <Dropzone.Reject>
              Only images (JPEG, PNG, SVG, GIF) under 1.5MB
            </Dropzone.Reject>
            <Dropzone.Idle>Upload an image</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag & drop image files here to upload. We accept only{" "}
            <i>.jpeg, .png, .svg, .gif</i> files that are less than 1.5MB.
          </Text>
        </div>
      </Dropzone>

      {/* Button to open file dialog */}
      <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
      >
        Select files
      </Button>

      {/* Image preview and submit button */}
      {imagePreview && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Image
            src={imagePreview}
            alt="Preview"
            width={200}
            height={200}
            style={{ borderRadius: theme.radius.md }}
          />
          <Button size="md" radius="xl" mt="md" onClick={handleFileUpload}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
