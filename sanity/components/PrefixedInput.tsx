import { useCallback } from 'react'
import { StringInputProps, set, unset } from 'sanity'
import { TextInput, Flex, Box, Text } from '@sanity/ui'

/**
 * A string input that displays a fixed prefix (e.g. "RMGDRI-").
 * The stored value includes the prefix, but the user only types the suffix.
 */
export function PrefixedInput(props: StringInputProps & { prefix?: string }) {
  const { onChange, value = '', elementProps } = props
  const prefix = props.prefix || 'RMGDRI-'

  // Strip prefix for display in the editable portion
  const suffix = value.startsWith(prefix) ? value.slice(prefix.length) : value

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSuffix = event.currentTarget.value
      if (newSuffix) {
        onChange(set(`${prefix}${newSuffix}`))
      } else {
        onChange(unset())
      }
    },
    [onChange, prefix],
  )

  return (
    <Flex align="center" gap={1}>
      <Box
        paddingX={3}
        paddingY={2}
        style={{
          background: 'var(--card-muted-bg-color)',
          borderRadius: '4px 0 0 4px',
          border: '1px solid var(--card-border-color)',
          borderRight: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <Text size={1} weight="semibold" muted>
          {prefix}
        </Text>
      </Box>
      <Box flex={1}>
        <TextInput
          {...elementProps}
          value={suffix}
          onChange={handleChange}
          placeholder="YYYY-###"
          style={{ borderRadius: '0 4px 4px 0' }}
        />
      </Box>
    </Flex>
  )
}
