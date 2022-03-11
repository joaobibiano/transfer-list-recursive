import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

const ORIGINAL_DATA_SOURCE = [
  {
    id: 0,
    title: "1 - OPC UA C++ Demo Server",
    parentName: "Cobrideira.PLCcobrideira",
    items: [
      {
        object: "PIDCONTROLLERVALUES_8",
        items: [
          {
            name: "ACTUAL_TEMP_REAL",
          },
          {
            name: "DEV_ALARM_TEMP_REAL",
          },
        ],
      },
      {
        object: "PIDCONTROLLERVALUES_6",
        items: [
          {
            name: "ACTUAL_TEMP_REAL",
          },
          {
            name: "Y_C",
          },
        ],
      },
    ],
  },
  {
    id: 1,
    title: "2 - OPC UA C++ Demo Server 1",
    parentName: "Cobrideira.PLCcobrideira 1",
    items: [
      {
        object: "PIDCONTROLLERVALUES_9",
        items: [
          {
            name: "Y_C",
          },
          {
            name: "DEV_ALARM_TEMP_REAL",
          },
        ],
      },
    ],
  },
];

export default function TransferList() {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [left, setLeft] = React.useState(ORIGINAL_DATA_SOURCE);
  const [right, setRight] = React.useState<typeof ORIGINAL_DATA_SOURCE>([]);

  function toggleCheckBox(objectName: string) {
    const exists = checked.find((item) => item === objectName);
    if (exists) {
      setChecked((prev) => prev.filter((i) => i !== exists));
    } else {
      setChecked((prev) => [...prev, objectName]);
    }
  }

  function shouldSelectParent(parent: any) {
    let shouldSelect = false;
    for (const section of parent?.items) {
      if (checked.includes(section.object)) {
        shouldSelect = true;
      }
    }

    return shouldSelect;
  }

  function handleCheckedRight() {
    const sectionsRight = checked.map((objectName) => {
      const parent = left.find((section) =>
        section.items.find((item) => item.object === objectName)
      );

      return parent?.items.find((item) => item.object === objectName)!;
    });

    if (!sectionsRight || sectionsRight.length === 0) return;

    const rightNewItems = sectionsRight.reduce<typeof ORIGINAL_DATA_SOURCE>(
      (acc, currentSection) => {
        const parent = left.find((section) =>
          section.items.find((item) => item.object === currentSection?.object)
        )!;

        const parentExistsOnAcc = acc.find((p: any) => p.id === parent?.id);

        if (parentExistsOnAcc) {
          parentExistsOnAcc.items.push(currentSection);
        } else {
          acc.push({
            ...parent,
            items: [currentSection],
          });
        }

        return acc;
      },
      []
    );

    let newLeft = left.map((parent) => {
      return {
        ...parent,
        items: parent.items.filter((item) => !checked.includes(item.object)),
      };
    });

    newLeft = newLeft.filter((parent) => parent.items.length > 0);

    const newRight = rightNewItems.reduce((acc, currentParent) => {
      const parentExistsOnAcc = acc.find((p) => p.id === currentParent?.id);

      if (parentExistsOnAcc) {
        parentExistsOnAcc.items = [
          ...parentExistsOnAcc.items,
          ...currentParent.items,
        ];
      } else {
        acc.push(currentParent);
      }

      return acc;
    }, right);

    setChecked([]);
    setRight(newRight);
    setLeft(newLeft);
  }

  function handleCheckedLeft() {
    const sectionsLeft = checked.map((objectName) => {
      const parent = right.find((section) =>
        section.items.find((item) => item.object === objectName)
      );

      return parent?.items.find((item) => item.object === objectName)!;
    });

    if (!sectionsLeft || sectionsLeft.length === 0) return;

    const leftNewItems = sectionsLeft.reduce<typeof ORIGINAL_DATA_SOURCE>(
      (acc, currentSection) => {
        const parent = right.find((section) =>
          section.items.find((item) => item.object === currentSection?.object)
        )!;

        const parentExistsOnAcc = acc.find((p: any) => p.id === parent?.id);

        if (parentExistsOnAcc) {
          parentExistsOnAcc.items.push(currentSection);
        } else {
          acc.push({
            ...parent,
            items: [currentSection],
          });
        }

        return acc;
      },
      []
    );

    let newRight = right.map((parent) => {
      return {
        ...parent,
        items: parent.items.filter((item) => !checked.includes(item.object)),
      };
    });

    newRight = newRight.filter((parent) => parent.items.length > 0);

    const newLeft = leftNewItems.reduce((acc, currentParent) => {
      const parentExistsOnAcc = acc.find((p) => p.id === currentParent?.id);

      if (parentExistsOnAcc) {
        parentExistsOnAcc.items = [
          ...parentExistsOnAcc.items,
          ...currentParent.items,
        ];
      } else {
        acc.push(currentParent);
      }

      return acc;
    }, left);

    setChecked([]);
    setLeft(newLeft);
    setRight(newRight);
  }

  const customList = (items: typeof left) => (
    <Paper sx={{ width: 500, height: 330, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items.map((parent, parentIndex) => {
          return (
            <div key={parent.id}>
              <ListItem role="listitem" button>
                <ListItemText primary={parent.title} />
              </ListItem>
              <ListItem
                onClick={() => {
                  for (const section of parent.items) {
                    toggleCheckBox(section.object);
                  }
                }}
                role="listitem"
                button
              >
                <ListItemIcon>
                  <Checkbox checked={shouldSelectParent(parent)} />
                </ListItemIcon>
                <ListItemText primary={parent.title} />
              </ListItem>
              {parent.items.map((section, sectionIndex) => {
                return (
                  <div key={section.object}>
                    <ListItem role="listitem" button>
                      <ListItemText primary={`∟ ${section.object}`} />
                    </ListItem>

                    {section.items.map((child, childIndex) => {
                      return (
                        <ListItem
                          onClick={() => {
                            toggleCheckBox(section.object);
                          }}
                          key={child.name}
                          role="listitem"
                          button
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={checked.includes(section.object)}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${childIndex} - ${child.name}`}
                          />
                        </ListItem>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList(left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(right)}</Grid>
      </Grid>

      {/* <pre>{JSON.stringify(checked, null, 2)}</pre> */}
    </div>
  );
}
