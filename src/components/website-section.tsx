import Feather from '@expo/vector-icons/Feather';
import {
  Button,
  Description,
  Input,
  Label,
  TextField,
  useThemeColor,
} from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SectionHeader } from './section-header';

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getUrlHost(value: string) {
  if (!value) {
    return 'Not set';
  }

  const withoutProtocol = value.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  return withoutProtocol.split('/')[0]?.replace(/^www\./i, '') || value;
}

export function WebsiteSection({
  webUrl,
  onSave,
}: {
  webUrl: string;
  onSave: (url: string) => void;
}) {
  const [muted] = useThemeColor(['muted']);
  const [urlDraft, setUrlDraft] = useState({ source: webUrl, value: webUrl });

  const urlInput = urlDraft.source === webUrl ? urlDraft.value : webUrl;
  const normalizedUrl = normalizeUrl(urlInput);
  const hasUrlChanges = normalizedUrl !== webUrl;
  const activeHost = getUrlHost(webUrl);

  const commitUrl = () => {
    setUrlDraft({ source: normalizedUrl, value: normalizedUrl });
    onSave(normalizedUrl);
  };

  return (
    <View className="-mx-1 gap-4 rounded-[14px] border border-border bg-background p-4">
      <SectionHeader
        icon="globe"
        title="Website"
        description="Active target for the WebView tab."
      />

      <TextField>
        <Label>
          <Label.Text>Website URL</Label.Text>
        </Label>
        <Input
          value={urlInput}
          onChangeText={(value) => setUrlDraft({ source: webUrl, value })}
          onBlur={commitUrl}
          onSubmitEditing={commitUrl}
          placeholder="https://example.com"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
        <Description>
          {hasUrlChanges
            ? 'Unsaved change'
            : webUrl
              ? `Live at ${activeHost}`
              : 'No website set'}
        </Description>
      </TextField>

      <Button
        variant={hasUrlChanges ? 'primary' : 'secondary'}
        onPress={commitUrl}
        isDisabled={!hasUrlChanges}
        className="disabled:opacity-100"
      >
        <Feather
          name={hasUrlChanges ? 'check' : 'check-circle'}
          size={17}
          color={hasUrlChanges ? '#FFFFFF' : muted}
        />
        <Button.Label>
          {hasUrlChanges ? 'Apply website' : 'Website applied'}
        </Button.Label>
      </Button>
    </View>
  );
}
