import { TextInput, Text, Stack, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form/lib/types";
import { useTranslation } from "react-i18next";
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { DateInput } from '@mantine/dates';
import { GameFormValues } from "../../types/game";

export const BasicInfo = ({ form }: { form: UseFormReturnType<GameFormValues> }) => {
    const { t } = useTranslation()
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: form.values.description,
        onUpdate({ editor }) {
            form.setFieldValue('description', editor.getHTML());
        },
    });

    return (
        <Stack gap="md">
            <TextInput
                withAsterisk
                label={t('game.fields.originalName.label')}
                description={t('game.fields.originalName.description')}
                key={form.key('originalName')}
                {...form.getInputProps('originalName')}
            />
            <div className="grid grid-cols-2 gap-4">
                <DateInput 
                    label={t('game.fields.releaseDate.label')} 
                    description={t('game.fields.releaseDate.description')} 
                    {...form.getInputProps('releaseDate')} 
                />
                <Select 
                    withAsterisk
                    data={[
                        { label: t('game.fields.types.options.rpg'), value: 'RPG' },
                        { label: t('game.fields.types.options.visualNovel'), value: 'VISUAL_NOVEL' },
                        { label: t('game.fields.types.options.action'), value: 'ACTION' },
                        { label: t('game.fields.types.options.simulation'), value: 'SIMULATION' },
                        { label: t('game.fields.types.options.strategy'), value: 'STRATEGY' },
                        { label: t('game.fields.types.options.other'), value: 'OTHER' },
                    ]}
                    label={t('game.fields.types.label')}
                    description={t('game.fields.types.description')}
                    key={form.key('type')}
                    {...form.getInputProps('type')}
                />
            </div>

            <div>
                <Text>{t('game.fields.description.label')}</Text>
                <Text size="xs" c='dimmed' mb={4}>{t('game.fields.description.description')}</Text>
                <RichTextEditor editor={editor} variant="subtle" h={500}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>
            </div>
        </Stack>
    );
}