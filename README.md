MapleTabs
==========
hackRU Spring 2014 Project (Awarded "Best Solo Hack")

MapleTabs is a tab manager for chrome that uses navigation history to organize tabs.
Tabs are organized into a tree like data structure which can viewed when clicking on the extension icon.  
As shown...  
(put picture of a tree here)

MapleTabs is still in its first rendition so expect it to be fairly buggy. I've compiled a list to go through but if you find any, please let me know at eric.song@rutgers.edu! Any thoughts or feature requests are also appreciated.

## How to install
1. Download/clone the repository
2. Go to chrome's extension page, "chrome://extensions"
3. Click "Load unpacked extension..."
4. Navigate to the repository folder and click "Open"
5. MapleTabs should now be installed

## How to use
1. Click the extension icon
2. Scroll to the bottom of chrome's extension page and open "Keyboard shortcuts"
3. Set hotkeys for "Tab Tree shift down" and "tab Tree shift up" under MapleTabs, I recommend "Ctrl+Shift+Down" for shift down and "Ctrl+Shift+Up" for shift up
4. Click "Start" within the popup window. A new window will pop up with instructions.
5. Browse the web!

## How it works
###Adding new tabs
New tabs that are opened from a page (through a link) will not show up in the current window. Instead, they are stored as children of the current page.  
(pic of page), (pic of adding a link), (show updated tree)

Opening a new tab through _(Control+T)_ will store the new tab as a sibling node of the current page.   
(picture of new tab)

###Opening tabs and navigating through the tree
The window will always show the current tab and all of its siblings.

__The current tab is highlighted red.__

For example, here, the active tab in the tree is the "reddit.com" tab. This node has 3 siblings so the window would contain the 4 tabs.
(picture of tree)

In order to open a new set of tabs, you can either shift up or down a level in the tree.

Shifting up will open the current tab's parent tab and all of its siblings.  
_Hotkey: "Ctrl+Shift+Up"_
(picture of tree shifted up)

Shifting down will open all of the current tab's children.  
_Hotkey: "Ctrl+Shift+Down"_
(picture of tree shifted down)

__The hotkeys for shifting up and down must be set from the chrome extensions page. Refer to Step 3 in "How to Use" for instructions__

##Motivation
The app was motivated by two ideas. 

First, I noticed that many of the tabs I open can easily be linked to the page I opened them from. For example, when I browse Reddit, I like to open all the links I'm interested in and browse through them. This is ok if the only site I'm browsing is Reddit. However, if I have several other sites open (which is often the case), the browser can get very cluttered and messy. 

Second, I often wonder how I navigated to certain links and get lost in the browser's history when trying to navigate my way backwards. This app provides a potentially more intuitive way to backtrace your navigation history. 
