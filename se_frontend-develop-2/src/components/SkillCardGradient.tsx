import { IconLibraryPlus , IconSailboat, IconTrashX, IconEdit } from '@tabler/icons-react';
import { Paper, Text, TextInput, ThemeIcon } from '@mantine/core';
import classes from './SkillCardGradient.module.css';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

type SkillCardGradientType = {
    title: string
    content: string
    isAddNewSkill?: boolean
}

export function SkillCardGradient({title, content, isAddNewSkill = false}: SkillCardGradientType) {
  const [editSkillOpened, { toggle: editSkillToggle, close: editSkillClose }] = useDisclosure(false);
  const [addSkillOpened, { toggle: addSkillToggle, close: addSkillClose }] = useDisclosure(false);
  const [confirmDeleteSkillOpened, { toggle: confirmDeleteSkillToggle, close: confirmDeleteSkillClose }] = useDisclosure(false);
  const [skillNameValue, setSkillNameValue] = useState<string>('')
  const [skillNameError, setSkillNameError] = useState<string>('')
  const [descriptionValue, setDescriptionValue] = useState<string>('')
  const [descriptionError, setDescriptionError] = useState<string>('')
  const [skillNameAddValue, setSkillNameAddValue] = useState<string>('')
  const [skillNameAddError, setSkillNameAddError] = useState<string>('')
  const [descriptionAddValue, setDescriptionAddValue] = useState<string>('')
  const [descriptionAddError, setDescriptionAddError] = useState<string>('')

  useEffect(() => {
    setSkillNameValue(title)
    setDescriptionValue(content)

    setSkillNameError('')
    setDescriptionError('')
  }, [editSkillOpened])

  useEffect(() => {
    setSkillNameAddValue('')
    setDescriptionAddValue('')

    setSkillNameError('')
    setDescriptionError('')
  }, [addSkillOpened])

  const validateEditData = () => {
    let isValidateSkillName = true
    setSkillNameError('')
    setDescriptionError('')

    // skill name validation
    if (skillNameValue == '') {
      isValidateSkillName = false
      setSkillNameError('Please enter your skill')
    }

    return isValidateSkillName
  }

  const onUserConfirmEdit = () => {
    if (validateEditData()) {
      // TODO: save data to DB 
    }
  }

  const validateAddData = () => {
    let isValidateSkillAddName = true
    setSkillNameAddError('')
    setDescriptionAddError('')

    // skill name validation
    if (skillNameAddValue == '') {
      isValidateSkillAddName = false
      setSkillNameAddError('Please enter your skill')
    }

    return isValidateSkillAddName
  }

  const onUserConfirmAdd = () => {
    if (validateAddData()) {
      // TODO: add data to DB 
    }
  }

  return (
    <Paper 
      withBorder 
      radius="md" 
      className={classes.card}
      onClick={() => {isAddNewSkill && !addSkillOpened ? addSkillToggle() : null}}
    >
      <Text className='absolute right-3 top-3' size="xl" fw={500}>
        {!isAddNewSkill &&
          <IconEdit 
            className='text-sky-500 hover:text-sky-300' 
            size={28} 
            stroke={2}
            onClick={editSkillToggle}
          />
        }
      </Text>

      <Modal 
        opened={editSkillOpened} 
        onClose={editSkillClose} 
        title="Edit Skill"
        styles={{
          title: {
            fontWeight: "bold",
          },
        }}
      >
        <TextInput
          mt="md"
          label="Skill"
          placeholder="your skill"
          required
          error={skillNameError}
          inputWrapperOrder={['label', 'input', 'error']}
          value={skillNameValue}
          onChange={(event) => setSkillNameValue(event.target.value)}
        />

        <TextInput
          mt="md"
          label="Description"
          placeholder="your description"
          error={descriptionError}
          inputWrapperOrder={['label', 'input', 'error']}
          value={descriptionValue}
          onChange={(event) => setDescriptionValue(event.target.value)}
        />
        
        <div className="mt-6 w-full flex justify-end">
          <button 
            className="flex text-base bg-red-500 text-white px-3 py-1 rounded-sm hover:bg-red-400 transition"
            onClick={confirmDeleteSkillToggle}
          >
            <IconTrashX className='mr-1' size={22} stroke={2} /> Delete
          </button>

          <button 
            className="text-base bg-green-600 text-white px-3 py-1 ml-2 rounded-sm hover:bg-green-500 transition"
            onClick={onUserConfirmEdit}
          >
            Confirm
          </button>

          <button 
            className="text-base bg-gray-500 text-white px-3 py-1 ml-2 rounded-sm hover:bg-gray-400 transition"
            onClick={editSkillToggle}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal 
        opened={confirmDeleteSkillOpened} 
        onClose={confirmDeleteSkillClose} 
        title={`Delete ${title} Skill`}
        styles={{
          title: {
            fontWeight: "bold",
          },
        }}
      >
        <p>Do you want to delete your {title} skill?</p>

        <div className="mt-6 w-full flex justify-end">
          <button 
            className="text-base bg-green-600 text-white px-3 py-1 ml-2 rounded-sm hover:bg-green-500 transition"
            onClick={() => {}}
          >
            Confirm
          </button>

          <button 
            className="text-base bg-gray-500 text-white px-3 py-1 ml-2 rounded-sm hover:bg-gray-400 transition"
            onClick={confirmDeleteSkillToggle}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ deg: 0, from: 'skyblue', to: 'green' }}
      >
        {isAddNewSkill ? 
          <IconLibraryPlus size={28} stroke={2} />
          : <IconSailboat size={28} stroke={2} />
        }
      </ThemeIcon>

      <Text size="xl" fw={500} mt="md">
        {title}
      </Text>

      <Text size="sm" mt="sm" c="dimmed">
        {content}
      </Text>

      <Modal 
        opened={addSkillOpened} 
        onClose={addSkillClose} 
        title={`Add skill`}
        styles={{
          title: {
            fontWeight: "bold",
          },
        }}
      >
        <TextInput
          mt="md"
          label="Skill"
          placeholder="your skill"
          required
          error={skillNameAddError}
          inputWrapperOrder={['label', 'input', 'error']}
          value={skillNameAddValue}
          onChange={(event) => setSkillNameAddValue(event.target.value)}
        />

        <TextInput
          mt="md"
          label="Description"
          placeholder="your description"
          error={descriptionAddError}
          inputWrapperOrder={['label', 'input', 'error']}
          value={descriptionAddValue}
          onChange={(event) => setDescriptionAddValue(event.target.value)}
        />

        <div className="mt-6 w-full flex justify-end">
          <button 
            className="text-base bg-green-600 text-white px-3 py-1 ml-2 rounded-sm hover:bg-green-500 transition"
            onClick={onUserConfirmAdd}
          >
            Confirm
          </button>

          <button 
            className="text-base bg-gray-500 text-white px-3 py-1 ml-2 rounded-sm hover:bg-gray-400 transition"
            onClick={addSkillToggle}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </Paper>
  );
}