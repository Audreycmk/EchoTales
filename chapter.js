$(function () {
    let unsolvedChapters = [1, 2, 3];
    localStorage.progress = localStorage.progress || 0;
    const $checkButton = $(".check-button").prop("disabled", true); // Initially disabled
  
    function getExpectedMapping() {
      // Defines the correct order (1 → Zone 1, 2 → Zone 2, 3 → Zone 3)
      return {
        "big-droppable-1": "big-draggable-1",
        "big-droppable-2": "big-draggable-2",
        "big-droppable-3": "big-draggable-3"
      };
    }
  
    function resetDroppables() {
      $(".droppable").each(function () {
        $(this)
          .data("dropped", null)
          .removeClass("ui-state-highlight")
          .find("p")
          .html("Drop Here");
      });
    }

    // Enable "Check" button only if all 3 cards are placed (anywhere)
    function updateCheckButtonState() {
      const allPlaced = (
        $("#big-droppable-1").data("dropped") && 
        $("#big-droppable-2").data("dropped") && 
        $("#big-droppable-3").data("dropped")
      );
      $checkButton.prop("disabled", !allPlaced);
    }
  
    // Initialize all draggables
    $(".draggable").draggable();
  
    // Initialize all droppables
    $(".droppable").droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        const droppedItem = ui.helper.attr("id");
        $(this)
          .data("dropped", droppedItem)
          .addClass("ui-state-highlight")
          .find("p")
          .html("Placed!");
        
        updateCheckButtonState(); // Update button state after drop
      },
      out: function (event, ui) {
        $(this)
          .data("dropped", null)
          .removeClass("ui-state-highlight")
          .find("p")
          .html("Drop Here");
        
        updateCheckButtonState(); // Update button state after removal
      }
    });
  
    // Set up click events for draggables to show corresponding audio
    $(".draggable").each(function () {
      let startX = 0, startY = 0;
      let wasDragged = false;
      const $el = $(this);
    
      $el.on("touchstart", function (e) {
        const touch = e.originalEvent.touches[0];
        startX = touch.pageX;
        startY = touch.pageY;
        wasDragged = false;
      });
    
      $el.on("touchmove", function (e) {
        const touch = e.originalEvent.touches[0];
        const dx = Math.abs(touch.pageX - startX);
        const dy = Math.abs(touch.pageY - startY);
        if (dx > 10 || dy > 10) {
          wasDragged = true; // it was a drag, not a tap
        }
      });
    
      $el.on("touchend", function (e) {
        if (!wasDragged) {
          // Handle "tap"
          const draggableId = $(this).attr("id");
          const audioMap = {
            "big-draggable-1": "#audio-10",
            "big-draggable-2": "#audio-11",
            "big-draggable-3": "#audio-12"
          };
    
          $(".audio-initial").hide().each(function () {
            this.pause();
          });
    
          if (audioMap[draggableId]) {
            $(audioMap[draggableId]).show()[0].play();
          }
        }
      });
    
      // Desktop support
      $el.on("click", function () {
        const draggableId = $(this).attr("id");
        const audioMap = {
          "big-draggable-1": "#audio-10",
          "big-draggable-2": "#audio-11",
          "big-draggable-3": "#audio-12"
        };
    
        $(".audio-initial").hide().each(function () {
          this.pause();
        });
    
        if (audioMap[draggableId]) {
          $(audioMap[draggableId]).show()[0].play();
        }
      });
    });
  
    $checkButton.click(function () {
      const currentPlacement = {
        "big-droppable-1": $("#big-droppable-1").data("dropped"),
        "big-droppable-2": $("#big-droppable-2").data("dropped"),
        "big-droppable-3": $("#big-droppable-3").data("dropped")
      };

      const correctMapping = getExpectedMapping();
      const isPerfectMatch = Object.keys(correctMapping).every(
        (droppableId) => currentPlacement[droppableId] === correctMapping[droppableId]
      );

      if (isPerfectMatch) {
        window.location.href = "/epilogue.html";
        resetDroppables();
        $(".draggable").draggable("enable").css({ top: 0, left: 0 });
      } else {
        const body = document.body;
        const originalFilter = body.style.filter;
        const originalBackgroundColor = body.style.background;
        const bgimage = body.style.backgroundImage;

        body.style.filter = "blur(5px)";
        body.style.backgroundColor = "red";
        body.style.backgroundImage = "none";

        setTimeout(() => {
          body.style.filter = originalFilter;
          body.style.background = originalBackgroundColor;
          body.style.backgroundImage = bgimage;
        }, 500);
      }
    });
});