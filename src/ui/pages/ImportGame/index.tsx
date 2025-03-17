import { Title, Divider, Stepper, SegmentedControl, Card } from "@mantine/core"
import { IconCategoryMinus, IconCode, IconFileDigit, IconImageInPicture, IconList, IconPlus, IconTerminal } from "@tabler/icons-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { BasicInfo } from "./BasicInfo"
import { useForm } from '@mantine/form';
import { GameType } from "@prisma/client"
import { MetadataInfo } from "./MetdataInfo"
import { GameFormValues } from "../../types/game"

export const ImportGame = () => {
    const { t } = useTranslation()
    const [active, setActive] = useState('basic')
    const form = useForm<GameFormValues>({
        initialValues: {
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            originalName: '',
            description: '',
            type: 'OTHER' as GameType,
            releaseDate: null,
            creators: [],
            tags: [],
            versions: [],
            localizations: []
        }
    })

    return (
        <div className="h-[calc(100vh-120px)] ">
            <div className="flex justify-between items-center h-12">
                <div className="flex items-center gap-4">
                    <Title order={4} className="text-2xl  flex gap-2 items-center">
                        <IconPlus width={32} height={32} color="#adb5bd" /> {t('gameList.addGame')}
                    </Title>
                </div>
            </div>
            <Divider className="mt-4" />
            <div className="p-4 flex h-full flex-col">
                <div className="w-full flex justify-center items-center mb-4">
                    <SegmentedControl data={[{
                        value: 'basic',
                        label: <span className="flex items-center justify-center gap-1"><IconList size={18}/>{t('import.game.basicInfo.label')}</span>
                    },
                    {
                        value: 'generes',
                        label: <span className="flex items-center justify-center gap-1"><IconCategoryMinus size={18}/>{t('import.game.generes.label')}</span>
                    },
                    {
                        value: 'media',
                        label: <span className="flex items-center justify-center gap-1"><IconImageInPicture size={18}/>{t('import.game.media.label')}</span>
                    },
                    {
                        value: 'installation',
                        label: <span className="flex items-center justify-center gap-1"><IconTerminal size={18}/>{t('import.game.installation.label')}</span>
                    },
                    {
                        value: 'others',
                        label: <span className="flex items-center justify-center gap-1"><IconCode size={18}/>{t('import.game.other.label')}</span>
                    }
                    ]} value={active} onChange={setActive} />
                </div>

                <Card className="h-full" withBorder shadow="md" radius="md">
                    {active === 'basic' && <BasicInfo form={form} />}
                    {active === 'generes' && <MetadataInfo form={form} />}
                </Card>
            </div>
        </div>
    )
}