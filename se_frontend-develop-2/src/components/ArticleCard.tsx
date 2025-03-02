import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Image,
  Text,
  useMantineTheme,
} from '@mantine/core';
import classes from './ArticleCard.module.css';

type ArticleCardType = {
  url: string
  badgeList: string[]
  title: string
  description: string
  profileImage: string
  postOwner: string
  postedTime: string
  liked: number
}

export function ArticleCard({
  url, 
  badgeList,
  title, 
  description,
  profileImage,
  postOwner,
  postedTime,
  liked
}: ArticleCardType) {
  const theme = useMantineTheme();

  return (
    <Card withBorder padding="lg" radius="md" className={classes.card}>
      <Card.Section mb="sm">
        <Image
          src={url !== '' ? url : 'https://img.freepik.com/vecteurs-premium/vecteur-icone-image-par-defaut-page-image-manquante-pour-conception-site-web-application-mobile-aucune-photo-disponible_87543-11093.jpg'}
          alt={title}
          height={180}
        />
      </Card.Section>

      <div>
        {badgeList.map((badge: string) => {
          return (
            <Badge className='inline-block mr-2' w="fit-content" variant="light">
              {badge}
            </Badge>
          )
        })}
      </div>

      <Text fw={700} className={classes.title} mt="xs">
        {title}
      </Text>

      <Text fw={400} className={classes.title} mt="xs">
        {description}
      </Text>

      <div className='h-full flex flex-col justify-end'>
        <Group mt="lg">
          <Avatar
            src={profileImage !== '' ? profileImage : ''}
            radius="sm"
          />
          <div>
            <Text fw={500}>{postOwner}</Text>
            <Text fz="xs" c="dimmed">
              posted {postedTime}
            </Text>
          </div>
        </Group>

        <Card.Section 
          className={classes.footer}>
          <Group justify="space-between">
            <Text fz="xs" c="dimmed">
              {liked} people liked this
            </Text>
            <Group gap={0}>
              <ActionIcon variant="subtle" color="gray">
                <IconHeart size={20} color={theme.colors.red[6]} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <IconBookmark size={20} color={theme.colors.yellow[6]} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <IconShare size={20} color={theme.colors.blue[6]} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Group>
        </Card.Section>
      </div>
    </Card>
  );
}